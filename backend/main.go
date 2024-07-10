package main

import (
	"AetherNote/db"
	"AetherNote/handler"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"log"
	"log/slog"
	"net/http"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	client := db.CreateConnection()
	noteHandler := handler.NewNoteHandler(client)

	router := chi.NewMux()
	router.Use(middleware.Recoverer)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	listenAddr := ":8080"

	router.Post("/note/new", handler.Make(noteHandler.HandleNewNote))
	router.Get("/note/{id}", handler.Make(noteHandler.HandleExistingNote))

	slog.Info("API server running", "port", listenAddr)
	http.ListenAndServe(listenAddr, router)
}
