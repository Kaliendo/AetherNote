package handler

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"log/slog"
	"math/big"
	"net/http"
	"strings"
)

const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

type APIFunc func(w http.ResponseWriter, r *http.Request) error

func Make(h APIFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := h(w, r); err != nil {
			var apiErr APIError
			if errors.As(err, &apiErr) {
				writeJSON(w, apiErr.StatusCode, apiErr)
			} else {
				errResp := map[string]any{
					"statusCode": http.StatusInternalServerError,
					"msg":        "internal server error",
				}
				writeJSON(w, http.StatusInternalServerError, errResp)
			}
			slog.Error("HTTP API error", "err", err.Error(), "path", r.URL.Path)
		}
	}
}

func writeJSON(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func generateRandomString(length int) (string, error) {
	var sb strings.Builder
	charSetLength := big.NewInt(int64(len(CHARSET)))

	for i := 0; i < length; i++ {
		num, err := rand.Int(rand.Reader, charSetLength)
		if err != nil {
			return "", err
		}
		sb.WriteByte(CHARSET[num.Int64()])
	}
	return sb.String(), nil
}
