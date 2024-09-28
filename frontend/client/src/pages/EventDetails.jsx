import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const EventDetails = () => {
  const [event, setEvent] = useState({});
  const [invitees, setInvitees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  
  const [filteredInvitees, setFilteredInvitees] = useState([]);
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [contactMethod, setContactMethod] = useState("");
  const [contacts, setContacts] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const { id } = useParams();


  const handleSendMoreInvite = () => {
    setShowInviteOptions(true);
  };

  const handleContactMethodChange = (e) => {
    setContactMethod(e.target.value);
  };

  const handleContactsChange = (e) => {
    setContacts(e.target.value);
  };

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };


  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     const response = await axios.get(`http://localhost:5000/api/view-events/${id}`);
  //     // console.log(response.data);
  //     // console.log(response.data.owner.name);
      
      
  //     setEvent(response.data);
  //   };
  //   fetchEvent();
  // }, [id]);

  // // useEffect(() => {
  // //   const fetchInvitees = async () => {
  // //     const response = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
  // //     setInvitees(response.data);
  // //   };
  // //   fetchInvitees();
  // // }, [id]);

  // useEffect(() => {
  //   const fetchInvitees = async () => {
  //     const response = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
  //     setInvitees(response.data);
  //     setFilteredInvitees(response.data);
  //   };
  //   fetchInvitees();
  // }, [id]);





  // // const handleSearch = (e) => {
  // //   e.preventDefault();
  // //   const filteredInvitees = invitees.filter((invitee) => {
  // //     return invitee.email.toLowerCase().includes(searchQuery.toLowerCase());
  // //   });
  // //   setFilteredInvitees(filteredInvitees);
  // // };

  // // const handleAddInvitee = async (e) => {
  // //   e.preventDefault();
  // //   const response = await axios.post(`http://localhost:5000/api/add-invitee`, { eventId: id, contacts: email });
  // //   alert(`${response.data.message}`);
  // //   // console.log(response.data);
  // // };

  // useEffect(() => {
  //   const filteredInvitees = invitees.filter((invitee) => {
  //     return invitee.email.toLowerCase().includes(searchQuery.toLowerCase());
  //   });
  //   setFilteredInvitees(filteredInvitees);
  // }, [searchQuery, invitees]);

  // const handleAddInvitee = async (e) => {
  //   e.preventDefault();
  //   const response = await axios.post(`http://localhost:5000/api/add-invitee`, { eventId: id, contacts: email });
  //   alert(`${response.data.message}`);
  //   if (response.data.message === "Invitees added and emails sent successfully") {
  //     const newInvitee = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
  //     setInvitees(newInvitee.data);
  //     setFilteredInvitees(newInvitee.data);
  //   }
  //   // e.target.inviteeEmail.value = "";
  //   setEmail("");
  // };





















  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contactMethod === "comma") {
      const inviteeData = {
        eventId: id,
        contacts: contacts
      };
      const response = await axios.post(`http://localhost:5000/api/add-invitee`, inviteeData);
      if (response.data.message === "Invitees added and emails sent successfully") {
        alert(`${response.data.message}`);
        const newInvitee = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
        setInvitees(newInvitee.data);
        setFilteredInvitees(newInvitee.data);
      }
    } else if (contactMethod === "csv") {
      const formData = new FormData();
      formData.append("eventData", JSON.stringify({ eventId: id }));
      formData.append("csvFile", csvFile);
      const response = await axios.post(`http://localhost:5000/api/add-invitee/csv`, formData);
      if (response.data.message === "Invitees added and emails sent successfully") {
        alert(`${response.data.message}`);
        const newInvitee = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
        setInvitees(newInvitee.data);
        setFilteredInvitees(newInvitee.data);
      }
    }
    setShowInviteOptions(false);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await axios.get(`http://localhost:5000/api/view-events/${id}`);
      setEvent(response.data);
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchInvitees = async () => {
      const response = await axios.get(`http://localhost:5000/api/view-events/${id}/invitees`);
      setInvitees(response.data);
      setFilteredInvitees(response.data);
    };
    fetchInvitees();
  }, [id]);

  useEffect(() => {
    const filteredInvitees = invitees.filter((invitee) => {
      return invitee.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredInvitees(filteredInvitees);
  }, [searchQuery, invitees]);



















  
  

  return (
    <div>
      <h2>Event Details</h2>
      <h3>{event.name}</h3>
      <p>Date: {event.date}</p>
      <p>Time: {event.time}</p>
      <p>Venue: {event.venue}</p>
      <h3>Invitees:</h3>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search invitees" />
      <ul>
        {filteredInvitees.map((invitee) => (
          <li key={invitee._id}>{invitee.email}</li>
        ))}
      </ul>
      
      {/* <form onSubmit={handleAddInvitee}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Add invitee" />
        <button type="submit">Add Invitee</button>
      </form> */}





      <button onClick={handleSendMoreInvite}>Send More Invite</button>
      {showInviteOptions && (
        <div>
          <h3>Send More Invite</h3>
          <select value={contactMethod} onChange={handleContactMethodChange}>
            <option value="">Select a method</option>
            <option value="comma">Comma Separated</option>
            <option value="csv">CSV File</option>
          </select>
          {contactMethod === "comma" && (
            <div>
              <input type="text" value={contacts} onChange={handleContactsChange} placeholder="Enter comma separated emails" />
            </div>
          )}
          {contactMethod === "csv" && (
            <div>
              <input type="file" onChange={handleCsvFileChange} />
            </div>
          )}
          <button onClick={handleSubmit}>Send Invite</button>
        </div>
      )}




      <Link to={`/scan`}>
        <button>Scan QR</button>
      </Link>



    </div>
  );
};

export default EventDetails;