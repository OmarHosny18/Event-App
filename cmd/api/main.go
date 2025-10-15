package main

import (
	"database/sql"
	"log"

	"rest-api-in-gin/internal/database"
	"rest-api-in-gin/internal/env"

	_ "github.com/joho/godotenv/autoload"
	_ "modernc.org/sqlite"
)

// @title Go Gin Rest API
// @version 1.0
// @description restAPI in Go using GIN.
//@securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

type application struct {
    port      int
    jwtSecret string
    models    database.Models
}

func main() {
    db, err := sql.Open("sqlite", "C:/Users/PC/Desktop/Event-App/data.db") 
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    models := database.NewModels(db)

    app := &application{
        port:      env.GetEnvInt("PORT", 8080),
        jwtSecret: "supersecretkey123",
        models:    models,
    }

    if err := app.serve(); err != nil {
        log.Fatal(err)
    }
}
