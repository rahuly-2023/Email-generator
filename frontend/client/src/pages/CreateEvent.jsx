import React, { useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const CreateEvent = () => {
  const { user, token } = useAuth();
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState("comma");
  const [contacts, setContacts] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [sendEmail, setSendEmail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      venue: venue,
      date: date,
      time: time,
      description: description,
      ownerEmail: user.email
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let response = await axios.post("http://localhost:5000/api/create-event", eventData, config);

    if (response.status === 200) {
      if (sendEmail) {
        if (contactMethod === "csv") {
          const formData = new FormData();
          formData.append("eventData", JSON.stringify(eventData));
          formData.append("csvFile", csvFile);

          const csvResponse = await axios.post("http://localhost:5000/api/add-invitee/csv", formData, config);

          if (csvResponse.status === 200) {
            alert("Event created and invitees added successfully");
          } else {
            alert("Error adding invitees");
          }
        } else if (contactMethod === "comma") {
          const inviteeData = {
            eventId: response.data.eventId,
            contacts: contacts
          };

          const inviteeResponse = await axios.post("http://localhost:5000/api/add-invitee", inviteeData, config);

          if (inviteeResponse.status === 200) {
            alert("Event created and invitees added successfully");
          } else {
            alert("Error adding invitees");
          }
        }
      } else {
        alert("Event created successfully");
      }
    } else {
      alert("Error creating event");
    }
  };

  return (
    <div className="create-event-form">
      <h2 className="form-title">Create New Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="eventName">Event Name:</label>
          <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="venue">Venue:</label>
          <input type="text" id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="time">Time:</label>
          <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contactMethod">Contact Method:</label>
          <select id="contactMethod" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className="form-select">
            <option value="comma">Comma Separated</option>
            <option value="csv">CSV File</option>
          </select>
        </div>
        {contactMethod === "comma" ? (
          <div className="form-group">
            <label className="form-label" htmlFor="contacts">Contacts:</label>
            <input type="text" id="contacts" value={contacts} onChange={(e) => setContacts(e.target.value)} className="form-input" />
          </div>
        ) : (
          <div className ="form-group">
            <label className="form-label" htmlFor="csvFile">CSV File:</label>
            <input type="file" id="csvFile" onChange={(e) => setCsvFile(e.target.files[0])} className="form-input" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="sendEmail">Send Email:</label>
          <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="form-checkbox" />
        </div>
        <button type="submit" className="form-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;