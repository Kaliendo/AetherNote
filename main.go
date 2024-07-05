package main

import (
	"AetherNote/db"
	"AetherNote/handler"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"log"
	"log/slog"
	"net/http"
	"os"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	client := db.CreateConnection()
	noteHandler := handler.NewNoteHandler(client)

	router := chi.NewMux()
	router.Use(middleware.Recoverer)
	listenAddr := fmt.Sprintf(":%s", os.Getenv("LISTEN_PORT"))

	router.Post("/note/new", handler.Make(noteHandler.HandleNewNote))
	router.Get("/note/{id}", handler.Make(noteHandler.HandleExistingNote))

	slog.Info("API server running", "port", listenAddr)
	http.ListenAndServe(listenAddr, router)
}
