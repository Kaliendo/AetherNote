package routes

import (
	"AetherNote/handler"
	"github.com/go-chi/chi/v5"
)

func NoteRoutes() chi.Router {
	r := chi.NewRouter()
	r.Post("/new", handler.Make(handler.HandleNewNote))
	return r
}
