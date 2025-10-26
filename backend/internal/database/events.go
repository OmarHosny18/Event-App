package database

import (
	"context"
	"database/sql"
	"time"
)

type EventModel struct {
	DB *sql.DB
}

type Event struct {
	Id          int    `json:"Id"`
	OwnerId     int    `json:"UserId" binding:"required"`
	Name        string `json:"Name" binding:"required,min=3"`
	Description string `json:"Description" binding:"required,min=10"`
	DateTime    string `json:"DateTime" binding:"required"` 
	Location    string `json:"Location" binding:"required,min=3"`
}

// ✅ Insert — PostgreSQL-compatible (uses $1, $2, ... + RETURNING id)
func (m *EventModel) Insert(event *Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO events (owner_id, name, description, datetime, location)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	err := m.DB.QueryRowContext(ctx, query,
		event.OwnerId,
		event.Name,
		event.Description,
		event.DateTime,
		event.Location,
	).Scan(&event.Id)

	if err != nil {
		return err
	}

	return nil
}

// ✅ GetAll — fetches all events
func (m *EventModel) GetAll() ([]*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT id, owner_id, name, description, datetime, location FROM events ORDER BY datetime DESC`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := make([]*Event, 0) // Initialize empty slice instead of nil
	for rows.Next() {
		var event Event
		err := rows.Scan(
			&event.Id,
			&event.OwnerId,
			&event.Name,
			&event.Description,
			&event.DateTime,
			&event.Location,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, &event)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

// ✅ Get — retrieves one event by ID (Postgres uses $1)
func (m *EventModel) Get(id int) (*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, owner_id, name, description, datetime, location
		FROM events
		WHERE id = $1
	`

	var event Event
	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&event.Id,
		&event.OwnerId,
		&event.Name,
		&event.Description,
		&event.DateTime,
		&event.Location,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // event not found
		}
		return nil, err
	}

	return &event, nil
}

// ✅ Update — PostgreSQL-compatible
func (m *EventModel) Update(event *Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE events
		SET name = $1, description = $2, datetime = $3, location = $4
		WHERE id = $5
	`

	_, err := m.DB.ExecContext(ctx, query,
		event.Name,
		event.Description,
		event.DateTime,
		event.Location,
		event.Id,
	)
	return err
}

// ✅ Delete — PostgreSQL-compatible
func (m *EventModel) Delete(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM events WHERE id = $1`
	_, err := m.DB.ExecContext(ctx, query, id)
	return err
}