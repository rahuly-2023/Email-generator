import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import "./QrStyles.css";
import { useParams } from "react-router-dom";

const QRScan = () => {

  const params = useParams();





  const { user } = useAuth();






  const [events, setEvents] = useState([]);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");





  // const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // const [events, setEvents] = useState([]);
  // const [selectedEventId, setSelectedEventId] = useState(null);
  const [invitee, setInvitee] = useState({});
  const [isInviteeCheckedIn, setIsInviteeCheckedIn] = useState(false);
  const [qrCode, setqrCode] = useState("");
  const [cameraPermission, setCameraPermission] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);
  const [boxColor, setBoxColor] = useState("white");
  const [message, setMessage] = useState("");
  const [scannedResult, setScannedResult] = useState("");
  // const params = useParams();

  const handleScan = (result, error) => {
    if (result) {
      const qrCodeText = result.text;
      setqrCode(qrCodeText);
      // console.log(qrCodeText); // Check if the qrCodeText is being logged correctly
      handleScanQR(qrCodeText); // Pass the qrCodeText directly to the handleScanQR function
    } else {
      handleError(error);
    }
  };
  const handleError = (error) => {
    if (error.name === 'NotAllowedError') {
      alert('Please allow camera access to scan QR code');
    } else {
      // console.error(error);
    }
  };


  useEffect(() => {
    if (invitee) {
      console.log("Updated Invitee:", invitee);
    }
  }, [invitee]);

  const handleScanQR = async (QR) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/view-events?ownerEmail=${user.email}`);
      const events = response.data;
      let inviteeFound = false;
      let eventFound = null;
      let inviteeDetails = null; // Temporary variable for invitee details

  
      for (const event of events) {
        const inviteesResponse = await axios.get(`http://localhost:5000/api/view-events/${event._id}/invitees`);
        const invitees = inviteesResponse.data;
  
        for (const invitee of invitees) {
          if (invitee._id === QR) {
            inviteeFound = true;
            eventFound = event;
            inviteeDetails = invitee; // Store invitee in a local variable
            console.log("invite details ",inviteeDetails);
            // setInvitee(invitee);
            break;
          }
        }
  
        if (inviteeFound) {
          break;
        }
      }
  
      if (!inviteeFound) {
        setBoxColor("red");
        setMessage("Invitee not found");
        setQrScanned(true);
        setScannedResult(true);
      } else {
        const serverTime = new Date();
        const eventDate = new Date(eventFound.date);
        const eventTime = eventFound.time.split(":");
        const eventDateTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), eventTime[0], eventTime[1]);
        const oneHourBeforeEvent = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
        const twoHoursAfterEvent = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000);
  
        if (serverTime < oneHourBeforeEvent) {
          setBoxColor("red");
          setMessage("Event has not started yet");
          setQrScanned(true);
          setScannedResult(true);
        } else if (serverTime > twoHoursAfterEvent) {
          setBoxColor("red");
          setMessage("Event has already passed");
          setQrScanned(true);
          setScannedResult(true);
        } else {
          if (inviteeDetails.checkedIn) {
            setBoxColor("red");
            setMessage("Invitee already checked in");
            setQrScanned(true);
            setScannedResult(true);
          } else {
            setBoxColor("green");
            setMessage("Invitee checked in successfully");
            setQrScanned(true);
            setScannedResult(true);
            // Update invitee's checkedIn status to true
            axios.put(`http://localhost:5000/api/update-invitee/${QR}`, { checkedIn: true });
          }
        }
        setInvitee(inviteeDetails);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // const handleEventChange = (e) => {
  //   setSelectedEventId(e.target.value);
  // };

  
  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      alert('Camera permission granted');
    } catch (error) {
      alert('Camera permission denied');
    }
  };
  
  // useEffect(() => {
    //   const fetchEvents = async () => {
      //     const ownerEmail = user.email; // Get the owner's email from useAuth
      //     const response = await axios.get(`http://localhost:5000/api/view-events?ownerEmail=${ownerEmail}`);
      //     console.log(response.data);
      //     setEvents(response.data);
      //   };
      //   fetchEvents();
      // }, [user]);

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.name === e.target.value);
    setSelectedEventName(e.target.value);
    setSelectedEventId(selectedEvent.id);
  };

      
  useEffect(() => {
    const fetchEvents = async () => {
      const ownerEmail = user.email; // Get the owner's email from useAuth
      const response = await axios.get(`http://localhost:5000/api/view-events?ownerEmail=${ownerEmail}`);
      console.log(response.data);
      
      const eventsData = response.data.map((event) => ({ id: event._id, name: event.name }));
      console.log(eventsData);

      setEvents(eventsData);
    };
    fetchEvents();
  }, [user]);

  return (
    <div>
      <h2>QR Scan</h2>
      <select value={selectedEventName || ""} onChange={handleEventChange}>
        <option value="">Select an event</option>
        {events.map((event) => (
          <option key={event.id} value={event.name}>
            {event.name}
          </option>
        ))}
      </select>

      {selectedEventName && (
        <div>
          <button onClick={requestCameraPermission}>Request Camera Permission</button>
          <br></br>
          <br />
          <br />
          <br />
          
          {/* <QrReader
            onResult={handleScan}
            onError={handleError}
            style={{ width: '50%' }}
          /> */}

          {/* {qrScanned && scannedResult && (
            <p
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                fontWeight: "bold",
                color: boxColor,
              }}
            >
              {message}
            </p>
          )} */}
          {qrScanned ? (
            <div>
              <button onClick={() => setQrScanned(false)}>Scan Next Code</button>
              <p
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: boxColor,
                }}
              >
                {message}
              </p>
              
            </div>
          ) : (
            
            <QrReader className="qr-reader"
              onResult={handleScan}
              onError={handleError}
              style={{ width: '50%' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QRScan;