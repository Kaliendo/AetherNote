package handler

import (
	"fmt"
	"net/http"
	"os"
)

type APIError struct {
	StatusCode int `json:"statusCode"`
	Msg        any `json:"msg"`
}

func (e APIError) Error() string {
	return fmt.Sprintf("api error: %d", e.StatusCode)
}

func NewAPIError(statusCode int, err error) APIError {
	return APIError{
		StatusCode: statusCode,
		Msg:        err.Error(),
	}
}

func InvalidRequestData(errors map[string]string) APIError {
	return APIError{
		StatusCode: http.StatusUnprocessableEntity,
		Msg:        errors,
	}
}

func InvalidJSON() APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Errorf("Invalid JSON request data"))
}

func EmptyRequestBody() APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Errorf("Request body must not be empty"))
}

func RequestBodyTooLarge() APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Errorf("Request body must not be larger than %s bytes", os.Getenv("UPLOAD_LIMIT")))
}

func InvalidContentType() APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Errorf("Content-Type header is not application/json"))
}

func InvalidNoteId() APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Errorf("Invalid Note ID"))
}

func NoteDoesNotExist() APIError {
	return NewAPIError(http.StatusNotFound, fmt.Errorf("The note doesn't exist"))
}
