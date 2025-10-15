package database

import (
	"context"
	"database/sql"
	"time"
)

type AttendeeModel struct {
	DB *sql.DB
}

type Attendee struct {
	Id      int `json:"id"`
	UserId  int `json:"userId"`
	EventId int `json:"eventId"`
}

// Insert adds a new attendee record and returns the inserted ID.
func (m *AttendeeModel) Insert(attendee *Attendee) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `INSERT INTO attendees (event_id, user_id) VALUES (?, ?)`
	result, err := m.DB.ExecContext(ctx, query, attendee.UserId, attendee.EventId)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	attendee.Id = int(id)
	return attendee.Id, nil
}

// GetByEventAndAttendee checks if a specific user is already an attendee of a specific event.

func (m *AttendeeModel) GetByEventAndAttendee(eventId, userId int) (*Attendee, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT * FROM attendees WHERE event_id = ? AND user_id = ?`
	var attendee Attendee
	err := m.DB.QueryRowContext(ctx, query, eventId, userId).Scan(&attendee.Id, &attendee.EventId, &attendee.UserId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &attendee, nil
}

// GetAttendeesByEvent retrieves all attendees for a given event ID.
func (m *AttendeeModel) GetAttendeesByEvent(eventId int) ([]*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT u.id, u.name, u.email
		FROM users u
		JOIN attendees a ON u.id = a.user_id 
		where a.event_id = ?`
	rows, err := m.DB.QueryContext(ctx, query, eventId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Name, &user.Email); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	return users,nil

}

func ( m *AttendeeModel) Delete(userId, eventID int) (error) {
ctx , cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()
query := `DELETE FROM attendees WHERE user_id = ? AND event_id = ?`
	_, err := m.DB.ExecContext(ctx,query,userId,eventID)
	if err != nil {
		return err
	}
	return nil	


}


func ( m *AttendeeModel) GetEventsByAttendee(attendeeId int) ([]*Event,error) {
ctx , cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()
query := `
SELECT e.id, e.owner_id, e.description, e.date, e.location 
FROM events e
JOIN attendees a ON e.id = a.event_id
WHERE a.user_id = ?`
rows, err := m.DB.QueryContext(ctx, query, attendeeId)
if err != nil {
	return nil, err
}
defer rows.Close()

var events []*Event
for rows.Next() {
	var event Event
	if err := rows.Scan(&event.Id, &event.OwnerId, &event.Description, &event.Date, &event.Location); err != nil {
		return nil, err
	}
	events = append(events, &event)
}
return events, nil
}




