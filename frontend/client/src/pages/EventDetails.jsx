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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contactMethod === "comma") {
      const inviteeData = {
        eventId: id,
        contacts: contacts,
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvitees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className=" flex flex-wrap justify-around mb-4">

        <div className="m-5  ring-1 ring-gray-900/5 bg-white px-3 pb-3 max-w-sm rounded-lg overflow-hidden shadow-lg mb-4 mr-4 bg-white  hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl "> 
            
            <div className="px-4 py-4 transition-all duration-300 group-hover:bg-sky-400">
              
              <div className="bg-navy font-semibold text-yellow rounded-lg text-center text-lg py-2  transition-all">
                {event.name}
              </div>
              
              <div className="mt-3 transition-all duration-300 group-hover:text-white/90">
                <p className="text-base text-gray-600">
                  <span className="font-bold">Date:</span> {event.date}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-bold">Time:</span> {event.time}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-bold">Venue:</span> {event.venue}
                </p>
              </div>

              

              <button
                onClick={handleSendMoreInvite}
                className="bg-orange hover:bg-yellow text-white font-bold py-2 px-4 rounded mr-4 mt-5">
                Send More Invite
              </button>

              

              <Link to={`/scan`}>
                <button
                    className="bg-orange hover:bg-yellow text-white font-bold py-2 px-4 rounded">
                    Scan QR CODE
                </button>
              </Link>





              {showInviteOptions && (
                <div className="bg-white p-4 rounded shadow-md mt-16">
                  {/* <h3 className="text-lg font-bold text-gray-800">Send More Invite</h3> */}
                  <select
                    value={contactMethod}
                    onChange={handleContactMethodChange}
                    className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
                  >
                    <option value="">Select a method</option>
                    <option value="comma">Comma Separated</option>
                    <option value="csv">CSV File</option>
                  </select>
                  {contactMethod === "comma" && (
                    <div>
                      <input
                        type="text"
                        value={contacts}
                        onChange={handleContactsChange}
                        placeholder="Enter comma separated emails"
                        className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded mt-5"
                      />
                    </div>
                  )}
                  {contactMethod === "csv" && (
                    <div>
                      <input
                        type="file"
                        onChange={handleCsvFileChange}
                        className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded mt-5"
                      />
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Send Invite
                  </button>
                </div>
              )}

            </div>
        </div>


        <div className="border w-full md:w-1/2 xl:w-1/2 p-6 text-lg  m-5 ring-1 ring-gray-900/5 px-3 pb-3 max-w-sm rounded-lg overflow-hidden shadow-lg bg-white  hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl " style={{ height: '700px', overflowY: 'auto' }}>
          <h3 className="bg-navy font-semibold text-yellow rounded-lg text-center text-lg py-2  transition-all mb-5">Invitees</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={( e) => setSearchQuery(e.target.value)}
            placeholder="Search invitees"
            className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded mb-5"
          />


          <ul className="list-none mb-4 ">
            {currentItems.map((invitee) => (
              <li key={invitee._id} className="py-2 border-b">
                <span className="text-gray-600">{invitee.email}</span>
              </li>
            ))}
          </ul>


          <div className="pagination flex justify-between">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-orange hover:bg-yellow text-white font-bold py-2 px-4 rounded-lg"
            >
              Prev
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredInvitees.length / itemsPerPage)}
              className="bg-orange hover:bg-yellow text-white font-bold py-2 px-4 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default EventDetails;