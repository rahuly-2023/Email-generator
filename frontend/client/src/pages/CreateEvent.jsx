import React, { useState, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!eventName) newErrors.eventName = "Event name is required";
    if (!venue) newErrors.venue = "Venue is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!description) newErrors.description = "Description is required";
    if (sendEmail) {
      if (contactMethod === "comma" && !contacts) newErrors.contacts = "Contacts are required";
      if (contactMethod === "csv" && !csvFile) newErrors.csvFile = "CSV file is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
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

      let response = await axios.post(`${BASE_URL}/api/create-event`, eventData, config);

      if (response.status === 200) {
        if (sendEmail) {
          if (contactMethod === "csv") {
            const formData = new FormData();
            formData.append("eventData", JSON.stringify(eventData));
            formData.append("csvFile", csvFile);

            const csvResponse = await axios.post(`${BASE_URL}/api/add-invitee/csv`, formData, config);

            if (csvResponse.status === 200) {
              setIsSubmitting(false);
              setAlertMessage("Event created and invitees added successfully");
              setAlertType("success");
            } else {
              setIsSubmitting(false);
              setAlertMessage("Error adding invitees");
              setAlertType("error");
            }
          } else if (contactMethod === "comma") {
            const inviteeData = {
              eventId: response.data.eventId,
              contacts: contacts
            };

            const inviteeResponse = await axios.post(`${BASE_URL}/api/add-invitee`, inviteeData, config);

            if (inviteeResponse.status === 200) {
              setIsSubmitting(false);
              setAlertMessage("Event created and invitees added successfully");
              setAlertType("success");
            } else {
              setIsSubmitting(false);
              setAlertMessage("Error adding invitees");
              setAlertType("error");
            }
          }
        } else {
          setIsSubmitting(false);
          setAlertMessage("Event created successfully");
          setAlertType("success");
        }
      } else {
        setIsSubmitting(false);
        setAlertMessage("Error creating event");
        setAlertType("error");
      }

      setEventName("");
      setVenue("");
      setDate("");
      setTime("");
      setDescription("");
      setContacts("");
      setCsvFile(null);
      setSendEmail(false);
    }
  };

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    }
  }, [alertMessage]);

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      {showAlert && (
        <div id="alert-border" className={`fixed top-0 left-0 z-50 flex items-center justify-between p-4 mb-4 w-full ${alertType === "success" ? "text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800" : " text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red -400 dark:bg-gray-800 dark:border-red-800"}`} role="alert">
          <div className="flex items-center">
            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <div className="ms-3 text-sm font-medium">
              {alertMessage}
            </div>
          </div>
          <button type="button" className={`ms-auto -mx-1.5 -my-1.5 ${alertType === "success" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"} rounded-lg focus:ring-2 focus:ring-${alertType === "success" ? "green-400" : "red-400"} p-1.5 hover:bg-${alertType === "success" ? "green-200" : "red-200"} inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-${alertType === "success" ? "green-400" : "red-400"} dark:hover:bg-gray-700`} data-dismiss-target="#alert-border" aria-label="Close">
            <span className="sr-only">Dismiss</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      )}


      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="text-3xl font-bold mb-6 text-navy text-center rounded-lg w-full bg-orange">Create New Event</div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="eventName">Event Name:</label>
          <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-950 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.eventName ? "border-red-500" : ""}`} />
          {errors.eventName && (
            <p className="text-red-500 text-sm">{errors.eventName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="venue">Venue:</label>
          <input type="text" id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.venue ? "border-red-500" : ""}`} />
          {errors.venue && (
            <p className="text-red-500 text-sm">{errors.venue}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.date ? "border-red-500" : ""}`} />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="time">Time:</label>
          <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.time ? "border-red-500" : ""}`} />
          {errors.time && (
            <p className="text-red-500 text-sm">{errors.time}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? "border-red-500" : ""}`} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contact Method:</label>
          <div className="flex items-center mb-2">
            <input type="radio" id="comma" value="comma" checked={contactMethod === "comma"} onChange={(e) => setContactMethod(e.target.value)} />
            <label className="ml-2 text-gray-700 dark:text-gray-300 text-sm font-bold" htmlFor="comma">Comma Separated</label>
          </div>
          <div className="flex items-center mb-2">
            <input type="radio" id="csv" value="csv" checked={contactMethod === "csv"} onChange={(e) => setContactMethod(e.target.value)} />
            <label className="ml-2 text-gray-700 dark:text-gray-300 text-sm font-bold" htmlFor="csv">CSV File</label>
          </div>
        </div>
        {contactMethod === "comma" ? (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="contacts">Contacts:</label>
            <input type="text" id="contacts" value={contacts} onChange={(e) => setContacts(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-950 leading-tight focus:outline-none focus:shadow-outline ${errors.contacts ? "border-red-500" : ""}`} />
            {errors.contacts && (
              <p className="text-red-500 text-sm">{errors.contacts}</p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="csvFile">CSV File:</label>
            <input type="file" id="csvFile" onChange={(e) => setCsvFile(e.target.files[0])} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${errors.csvFile ? "border-red-500" : ""}`} />
            {errors.csvFile && (
              <p className="text-red-500 text-sm">{errors.csvFile}</p>
            )}
          </div>
        )}
        <div className="mb-4 flex items-center ">
          <label className="px-2 text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="sendEmail">Send Email Now:</label>
          <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button type="submit" className="font-bold py-2 px-4 rounded mx-auto block">
          {isSubmitting ? (
            <div className="flex items-center justify-center text-white">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              Creating...
            </div>
          ) : (
            <div className="mx-auto p-2 mt-2 rounded-xl bg-yellow text text-xl  hover:bg-orange">Create Event</div>
            
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;