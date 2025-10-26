CREATE TABLE IF NOT EXISTS attendees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(user_id, event_id)
);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_attendees_user_id ON attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON attendees(event_id);