import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import "./QrStyles.css";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const [pauseScan, setPauseScan] = useState(false); // new state variable to track pause state



  const handleScan = (result, error) => {
    if (result) {
      const qrCodeText = result.text;
      setqrCode(qrCodeText);
      handleScanQR(qrCodeText);
      setPauseScan(true); // set pause state to true
      setTimeout(() => {
        setPauseScan(false); // reset pause state after 3 seconds
      }, 3000);
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
      const response = await axios.get(`${BASE_URL}/api/view-events?ownerEmail=${user.email}`);
      console.log(response);
      const events = response.data;
      let inviteeFound = false;
      let eventFound = null;
      let inviteeDetails = null; // Temporary variable for invitee details

  
      for (const event of events) {
        const inviteesResponse = await axios.get(`${BASE_URL}/api/view-events/${event._id}/invitees`);
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
            axios.put(`${BASE_URL}/api/update-invitee/${QR}`, { checkedIn: true });
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
      const response = await axios.get(`${BASE_URL}/api/view-events?ownerEmail=${ownerEmail}`);
      console.log(response.data);
      
      const eventsData = response.data.map((event) => ({ id: event._id, name: event.name }));
      console.log(eventsData);

      setEvents(eventsData);
    };
    fetchEvents();
  }, [user]);

  return (
    <div className='mx-auto w-1/2 mt-10'>
      <h2 className='bg-navy font-semibold text-center text-lg py-2  w rounded-lg p-2 text-yellow  m-auto mb-10'>QR Scan</h2>

      <div className='mx-auto w-fit'>
        <label for="countries" className="block font-medium text-gray-900">Select an option to scan qr code</label>
        <select value={selectedEventName || ""} onChange={handleEventChange} className='bg-gray-500 border border-gray-300 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full'>
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.name}>
              {event.name}
            </option>
          ))}
        </select>

      </div>

      {selectedEventName && (
        <div className='mt-10 '>
          


          <QrReader
            className="qr-reader"
            delay={300}
            onError={handleError}
            onResult={handleScan}
            style={{ width: '50%' }}
          />
          {pauseScan && (
            <div
              className={`bg-${boxColor}-100 border border-${boxColor}-500 text-${boxColor}-700 px-4 py-3 rounded relative`}
              role="alert"
            >
              <strong className="font-bold">{message}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScan;