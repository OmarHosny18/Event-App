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
	Id          int    `json:"id"`
	OwnerId     int    `json:"ownerId" binding:"required"`
	Name        string `json:"name" binding:"required,min=3"`
	Description string `json:"description" binding:"required,min=10"`
	Date        string `json:"date" binding:"required,datetime=2006-01-02"`
	Location    string `json:"location" binding:"required,min=3"`
}

// ✅ Insert — uses ExecContext + LastInsertId for SQLite compatibility
func (m *EventModel) Insert(event *Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `INSERT INTO events (owner_id, name, description, date, location)
	          VALUES (?, ?, ?, ?, ?)`

	result, err := m.DB.ExecContext(ctx, query,
		event.OwnerId,
		event.Name,
		event.Description,
		event.Date,
		event.Location,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	event.Id = int(id)
	return nil
}

// ✅ GetAll — fetches all events
func (m *EventModel) GetAll() ([]*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT * FROM events`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*Event
	for rows.Next() {
		var event Event
		err := rows.Scan(&event.Id, &event.OwnerId, &event.Name, &event.Description, &event.Date, &event.Location)
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

// ✅ Get — retrieves one event by ID
func (m *EventModel) Get(id int) (*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT * FROM events WHERE id = ?`

	var event Event
	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&event.Id,
		&event.OwnerId,
		&event.Name,
		&event.Description,
		&event.Date,
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

// ✅ Update — uses ExecContext and ? placeholders
func (m *EventModel) Update(event *Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE events 
	          SET name = ?, description = ?, date = ?, location = ? 
	          WHERE id = ?`

	_, err := m.DB.ExecContext(ctx, query,
		event.Name,
		event.Description,
		event.Date,
		event.Location,
		event.Id,
	)
	return err
}

// ✅ Delete — deletes one event by ID
func (m *EventModel) Delete(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM events WHERE id = ?`
	_, err := m.DB.ExecContext(ctx, query, id)
	return err
}
