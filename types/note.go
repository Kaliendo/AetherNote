package types

import (
	"AetherNote/config"
	"fmt"
	"os"
)

type Note struct {
	ID             string
	Data           string `json:"data"`
	Views          int    `json:"views"`
	Expiration     int    `json:"expiration"`
	CustomPassword bool   `json:"customPassword"`
}

type NoteResponse struct {
	Data           string `json:"data"`
	CustomPassword bool   `json:"customPassword"`
}

func (n *Note) Validate() map[string]string {
	errorMap := make(map[string]string)
	if n.Data == "" {
		errorMap["data"] = "Missing or invalid field"
	}
	if n.Views <= 0 {
		errorMap["views"] = "Missing or invalid field"
	}
	if n.Expiration < 0 {
		errorMap["expiration"] = "The expiration time must be at least 0"
	}
	if n.Expiration > config.GetMaxExpirationTime() {
		errorMap["expiration"] = "The expiration time can't exceed the limit"
	}
	return errorMap
}

func (n *Note) CreateHashKey() string {
	return fmt.Sprintf("%s:%s", os.Getenv("REDIS_PREFIX"), n.ID)
}

func (n *Note) CreateHashMap() map[string]any {
	return map[string]any{
		"data":           n.Data,
		"views":          n.Views,
		"customPassword": n.CustomPassword,
	}
}

func (n *Note) ToResponseNote() *NoteResponse {
	return &NoteResponse{
		n.Data,
		n.CustomPassword,
	}
}
