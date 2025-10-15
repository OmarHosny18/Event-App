package main

import (
	"net/http"
	"rest-api-in-gin/internal/database"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (app *application) createEvent(c *gin.Context) {
	var event database.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return	
	}
	err := app.models.Events.Insert(&event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated,event)
}
//Get events return all events
//
//@summary Get all events
//@description Get all events
//@Tags events
//@Accept json
//@Produce json
//@Success 200 {object} []database.Event
//@Router /api/v1/events [get]
func (app *application) getAllEvents(c *gin.Context) {
	events, err := app.models.Events.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve events"})
		return
	}
	c.JSON(http.StatusOK, events)
}



func (app *application) getEvent(c *gin.Context) {
 id, err := strconv.Atoi(c.Param("id"))
 if err != nil {
	 c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
	 return
 }
 event,err := app.models.Events.Get(id)
 if event ==nil{
	c.JSON(http.StatusNotFound, gin.H{"error":"Event not found"})
 }
 if err != nil {
	 c.JSON(http.StatusInternalServerError, gin.H{"error": "faild to retrive event"})

 }
 c.JSON(http.StatusOK,event)


}


func (app *application) updateEvent(c *gin.Context) {
	 id, err := strconv.Atoi(c.Param("id"))
	 if err != nil {
		 c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		 return
	 }
	exsistingEvent, err := app.models.Events.Get(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve event"})
		return
	}
	if exsistingEvent == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}
  updatedEvent := &database.Event{}

  if err:= c.ShouldBindJSON(updatedEvent); err != nil{
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
  }
  updatedEvent.Id = id
  if err :=app.models.Events.Update(updatedEvent); err != nil{
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update event"})
	return
  }
  c.JSON(http.StatusOK,updatedEvent)

}

func (app *application) deleteEvent(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}
	if err:= app.models.Events.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete event"})
		return
	}
	c.JSON(http.StatusNoContent,nil)
}


func (app *application) addAttendeeToEvent(c *gin.Context) {
	eventId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}
	userId, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	event,err:= app.models.Events.Get(eventId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve event"})
		return
	}
	if event == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}
	userToAdd, err := app.models.Users.Get(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}
	if userToAdd == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	exsistingAttendee,err := app.models.Attendees.GetByEventAndAttendee(event.Id,userToAdd.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing attendees"})
		return
	}
	if exsistingAttendee != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User is already an attendee of this event"})
		return
	}	
	attendee := database.Attendee{
		UserId:  userToAdd.Id,
		EventId: event.Id,
	}
	_,err = app.models.Attendees.Insert(&attendee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add attendee"})
		return
	}
	c.JSON(http.StatusCreated, attendee)
}

func (app *application) getAttendeesForEvent(c *gin.Context) {
	id,err :=strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}
	users,err := app.models.Attendees.GetAttendeesByEvent(id)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendees"})
}
c.JSON(http.StatusOK,users)
}

func (app *application) deleteAttendeeFromEvent(c *gin.Context) {
	id,err :=strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}
	userId,err :=strconv.Atoi(c.Param("UserId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	err = app.models.Attendees.Delete(userId,id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove attendee from event"})
		return
	}
	c.JSON(http.StatusNoContent,nil)
}

func (app *application) getEventsByAttendee(c *gin.Context) {
	id,err :=strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
	}
	events,err:= app.models.Attendees.GetEventsByAttendee(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve events for attendee"})
		return
	}
	c.JSON(http.StatusOK,events)
}

