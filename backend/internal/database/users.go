package database

import (
	"context"
	"database/sql"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

type User struct {
	Id       int    `json:"Id"`
	Email    string `json:"Email"`
	Name     string `json:"Name"`
	Password string `json:"-"` // omit from JSON responses
}

func (m *UserModel) Insert(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO users (email, name, password)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	err := m.DB.QueryRowContext(ctx, query, user.Email, user.Name, user.Password).Scan(&user.Id)
	if err != nil {
		return err
	}

	return nil
}


func (m *UserModel) getUser(query string, args ...interface{}) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var user User
	err := m.DB.QueryRowContext(ctx, query, args...).Scan(
		&user.Id,
		&user.Email,
		&user.Password,
		&user.Name,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (m *UserModel) Get(id int) (*User, error) {
	// ✅ PostgreSQL-style placeholder
	query := `SELECT id, email, password, name FROM users WHERE id = $1`
	return m.getUser(query, id)
}

func (m *UserModel) GetByEmail(email string) (*User, error) {
	// ✅ PostgreSQL-style placeholder
	query := `SELECT id, email, password, name FROM users WHERE email = $1`
	return m.getUser(query, email)
}
