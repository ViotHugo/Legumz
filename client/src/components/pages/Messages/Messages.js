import React, { useState,useRef,useEffect  } from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from './../../Header2/Header2';
const io = require("socket.io-client");
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Messages() {
  const { email } = useParams();
  const [newEmail,setnewEmail] = useState("")
  const [contactIni,setContactIni] = useState({})
  useEffect(() => {
    try {
      const parsed = JSON.parse(email);
      setContactIni(parsed.contactVisible);
      setnewEmail(parsed.email);
    } catch (error) {
      setContactIni(null);
      setnewEmail(email)
    }
  }, [email]);
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [messages,setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});
  const socketRef = useRef();
  const [contactVisible, setContactVisible] = useState({});
  const messagesEndRef = useRef(null);

  const [selectedContact, setSelectedContact] = useState(null);
  
  function processMessage(message) {
    let processedMessage = '';
    for (let i = 0; i < message.length; i += 100) {
      processedMessage += message.substring(i, i + 100) + '\n';
    }
    return processedMessage;
  }

  useEffect(() => {
    const socket = io("http://localhost:5000/", {
    query: { newEmail }
  });
    socketRef.current = socket;
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    async function fetchData() {
      try {
        const response = await axios.post('http://localhost:5000/recupMatchs', { email: newEmail });
        setContacts(response.data);
        const responseUser = await axios.post('http://localhost:5000/recupProfile', { email: newEmail });
        setUser(responseUser.data);
        if(response.data.length > 0){
          if(contactIni == null){
            setContactVisible(response.data[0]);
            setSelectedContact(response.data[0].email);
          }
          else{
            setContactVisible(contactIni);
            setSelectedContact(contactIni.email);
          }
          
          const response2 = await axios.post('http://localhost:5000/recupMessages', { email: newEmail });
          setMessages(response2.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    return () => {
      socket.disconnect();
    };
  }, [newEmail]);
  function handleContactClick(contact) {
    setContactVisible(contact);
    setSelectedContact(contact.email);
    setMessages([...messages]);
  }

  function renderContacts() {
    return contacts.map((contact, index) => (
      <div 
        className={`contactmessage ${contact.email === selectedContact ? 'contact-selected' : ''}`} 
        key={index} 
        onClick={() => handleContactClick(contact)}
      >
        <img
          src={contact.profilePicture}
          alt={contact.firstName}
          className="contact-image"
        />
        <span>{contact.firstName}</span>
      </div>
    ));
  }

  function renderMessages() {
    return messages.map((message) => {
      if (
        (message.email2 === contactVisible.email && message.email1 === newEmail) ||
        (message.email1 === contactVisible.email && message.email2 === newEmail)
      ) {
        let messageClass = "";
        if (message.email1 === newEmail) {
          messageClass = "message-sent";
        } else {
          messageClass = "message-received";
        }
        return (
          <div className={messageClass}>
            <p>
              {!message.type && message.email1 == user.email && <span className="sender">{user.firstName}</span>}
              {!message.type && message.email2 == user.email && <span className="sender">{contactVisible.firstName}</span>}
            </p>
            <pre>{processMessage(message.message)}</pre>
            {message.type && <pre>type : {processMessage(message.type)}</pre>}
            {message.lieu && <pre>adresse : {processMessage(message.lieu)}</pre>}
            {message.date && <pre>date : {processMessage(message.date)}</pre>}
            {message.heure && <pre>heure : {processMessage(message.heure)}</pre>}
            {/*<p>{message.message}</p>*/}
          </div>
        );
    }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newMessage){
      socketRef.current.emit('message',{email1:newEmail,email2:contactVisible.email,message:newMessage} );
      setMessages([...messages, {email1:newEmail,email2:contactVisible.email,message:newMessage}]);
      setNewMessage("");
    }
    
  } 

  function handleProposeMeeting() {
    const data = {
      user: user,
      contact: contactVisible
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    navigate('/rdvCarte/'+encodedData);
  }

  return (
    <div>
      <Header2 activePage="messages" email={newEmail} />
      <div className="messages">
        <div className="messages-content">
              <div className="message-list" >
                <div>{renderMessages()}<div ref={messagesEndRef} /></div>
              </div>   
          <form onSubmit={handleSubmit} className="new-message-form">
          
            <input
              type="text"
              className="new-message-input"
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-button-message">Envoyer</button>
            <button className="propose-meeting-message" onClick={handleProposeMeeting}>Proposer un RDV</button>
          </form>
        </div>
        <div className="messages-sidebar">{renderContacts()}</div>
      </div>
    </div>
  )
;}

export default Messages;
