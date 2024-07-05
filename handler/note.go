package handler

import (
	"AetherNote/db"
	"AetherNote/types"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type NoteHandler struct {
	db db.DB
}

func NewNoteHandler(db db.DB) *NoteHandler {
	return &NoteHandler{db: db}
}

func (h NoteHandler) HandleNewNote(w http.ResponseWriter, r *http.Request) error {
	if !strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		return InvalidContentType()
	}

	uploadLimit, err := strconv.Atoi(os.Getenv("UPLOAD_LIMIT"))
	if err != nil {
		return err
	}

	r.Body = http.MaxBytesReader(w, r.Body, int64(uploadLimit))

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	var n types.Note
	err = dec.Decode(&n)
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError

		switch {
		case errors.As(err, &syntaxError):
			return InvalidJSON()

		case errors.Is(err, io.ErrUnexpectedEOF):
			return InvalidJSON()

		case errors.As(err, &unmarshalTypeError):
			errorMap := map[string]string{
				unmarshalTypeError.Field: "Invalid value",
			}
			return InvalidRequestData(errorMap)

		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.ReplaceAll(strings.TrimPrefix(err.Error(), "json: unknown field "), "\"", "")
			errorMap := map[string]string{
				fieldName: "Unknown field",
			}
			return InvalidRequestData(errorMap)

		case errors.Is(err, io.EOF):
			return EmptyRequestBody()

		case err.Error() == "http: request body too large":
			return RequestBodyTooLarge()

		default:
			return err
		}
	}

	errorMap := make(map[string]string)
	if n.Data == "" {
		errorMap["data"] = "Missing or invalid field"
	}
	if n.Views <= 0 {
		errorMap["views"] = "Missing or invalid field"
	}
	if n.Expiration < 0 {
		errorMap["expiration"] = "Invalid field"
	}

	if len(errorMap) > 0 {
		return InvalidRequestData(errorMap)
	}

	n.ID, err = generateRandomString(32)
	if err != nil {
		return err
	}

	err = h.db.SaveNote(n)
	if err != nil {
		return err
	}

	return writeJSON(w, http.StatusCreated, n)
}
