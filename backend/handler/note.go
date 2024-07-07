package handler

import (
	"AetherNote/config"
	"AetherNote/db"
	"AetherNote/types"
	"encoding/json"
	"errors"
	"github.com/go-chi/chi/v5"
	"io"
	"net/http"
	"strings"
)

type NoteHandler struct {
	db db.DB
}

func NewNoteHandler(db db.DB) *NoteHandler {
	return &NoteHandler{db: db}
}

func (h NoteHandler) HandleNewNote(w http.ResponseWriter, r *http.Request) error {
	// we could use middleware.AllowContentType, but i'd rather have a custom error
	if !strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		return InvalidContentType()
	}

	r.Body = http.MaxBytesReader(w, r.Body, config.GetUploadLimit())

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	var note types.Note
	err := dec.Decode(&note)
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

	errorMap := note.Validate()

	if len(errorMap) > 0 {
		return InvalidRequestData(errorMap)
	}

	note.ID, err = generateRandomString(32)
	if err != nil {
		return err
	}

	err = h.db.SaveNote(note)
	if err != nil {
		return err
	}

	return writeJSON(w, http.StatusCreated, note.ToCreateNoteResponse())
}

func (h NoteHandler) HandleExistingNote(w http.ResponseWriter, r *http.Request) error {
	noteId := chi.URLParam(r, "id")
	if noteId == "" {
		return InvalidNoteId()
	}
	note, err := h.db.FetchNote(noteId)
	if err != nil {
		if err.Error() == "key does not exist" {
			return NoteDoesNotExist()
		}
		return err
	}
	return writeJSON(w, http.StatusOK, note.ToExistingNoteResponse())
}
