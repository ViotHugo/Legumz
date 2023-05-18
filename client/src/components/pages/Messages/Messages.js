import React, { useState,useRef,useEffect  } from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from './../../Header2/Header2';
const io = require("socket.io-client");
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Messages() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [messages,setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});
  const socketRef = useRef();
  const [contactVisible, setContactVisible] = useState({});
  const messagesEndRef = useRef(null);

  const [selectedContact, setSelectedContact] = useState(null);


  const messageListRef = useRef();
  const messageContainerRef = useRef();

  useEffect(() => {
  scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function processMessage(message) {
    let processedMessage = '';
    for (let i = 0; i < message.length; i += 100) {
      processedMessage += message.substring(i, i + 100) + '\n';
    }
    return processedMessage;
  }

  useEffect(() => {
    const socket = io("http://localhost:5000/", {
    query: { email }
  });
    socketRef.current = socket;
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    async function fetchData() {
      try {
        const response = await axios.post('http://localhost:5000/recupMatchs', { email: email });
        setContacts(response.data);
        const responseUser = await axios.post('http://localhost:5000/recupProfile', { email: email });
        setUser(responseUser.data);
        if(response.data.length > 0){
          setContactVisible(response.data[0]);
          setSelectedContact(response.data[0].email);
          const response2 = await axios.post('http://localhost:5000/recupMessages', { email: email });
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
  }, [email]);
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
        (message.email2 === contactVisible.email && message.email1 === email) ||
        (message.email1 === contactVisible.email && message.email2 === email)
      ) {
        let messageClass = "";
        if (message.email1 === email) {
          messageClass = "message-sent";
        } else {
          messageClass = "message-received";
        }
        return (
          <div className={messageClass}>
            <p>
              <span className="sender">{message.email1}</span>
            </p>
            <pre>{processMessage(message.message)}</pre>
            {/*<p>{message.message}</p>*/}
          </div>
        );
    }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newMessage){
      socketRef.current.emit('message',{email1:email,email2:contactVisible.email,message:newMessage} );
      setMessages([...messages, {email1:email,email2:contactVisible.email,message:newMessage}]);
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
      <Header2 activePage="messages" email={email} />
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
