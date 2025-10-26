package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"rest-api-in-gin/internal/database"
	"rest-api-in-gin/internal/env"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/lib/pq" // PostgreSQL driver
)

// @title Go Gin Rest API
// @version 1.0
// @description restAPI in Go using GIN.
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

type application struct {
	port      int
	jwtSecret string
	models    database.Models
}

func main() {
	// PostgreSQL connection
    dsn := os.Getenv("DATABASE_URL")

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Cannot connect to PostgreSQL:", err)
	}

	models := database.NewModels(db)

	app := &application{
		port:      env.GetEnvInt("PORT", 8080),
		jwtSecret: "supersecretkey123",
		models:    models,
	}

	log.Println("✅ Connected to PostgreSQL successfully!")

	if err := app.serve(); err != nil {
		log.Fatal(err)
	}
}

func (app *application) serve() error {
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.port),
		Handler:      app.routes(), // routes() now includes CORS
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("🚀 Server running on port %d\n", app.port)
	return server.ListenAndServe()
}
