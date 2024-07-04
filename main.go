package main

import (
	"AetherNote/routes"
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
	router := chi.NewMux()
	router.Use(middleware.Recoverer)
	listenAddr := fmt.Sprintf(":%s", os.Getenv("LISTEN_PORT"))

	router.Mount("/note", routes.NoteRoutes())

	slog.Info("API server running", "port", listenAddr)
	http.ListenAndServe(listenAddr, router)
}
