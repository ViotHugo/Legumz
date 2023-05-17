import React, { useState,useRef,useEffect  } from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from './../../Header2/Header2';
const io = require("socket.io-client");
import axios from 'axios';

function Messages() {
  const { email } = useParams();
  const [contacts,setContacts] = useState([]);
  const [messages,setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const [contactVisible, setContactVisible] = useState({});
  useEffect(() => {
    const socket = io("http://localhost:5000/", {
    query: { email }
  });
    socketRef.current = socket;
    socketRef.current.on("message", (message) => {
      console.log(`Message received from server: ${message}`);
      // traitez le message ici
    });

    async function fetchData() {
      try {
        const response = await axios.post('http://localhost:5000/recupMatchs', { email: email });
        setContacts(response.data);
        if(response.data.length > 0){
          setContactVisible(response.data[0]);
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

  function renderContacts() {
    return contacts.map((contact, index) => (
      <div className="contact" key={index}>
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
      const messageClass =
        message.type === 'sent' ? 'message-sent' : 'message-received';
      return (
        <div key={message.id} className={messageClass}>
          <p>
            <span className="sender">{message.sender}</span>
          </p>
          <p>{message.content}</p>
        </div>
      );
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    socketRef.current.emit('message',newMessage );
    setNewMessage("");
  } 

  return (
    <div>
      <Header2 activePage="messages" email={email} />
      <div className="messages">
        <div className="messages-content">
          <div className="message-list">{renderMessages()}</div>
          <form onSubmit={handleSubmit} className="new-message-form">
            <input
              type="text"
              className="new-message-input"
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
        <div className="messages-sidebar">{renderContacts()}</div>
      </div>
    </div>
  )
;}

export default Messages;
