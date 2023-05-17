import React, { useState,useRef,useEffect  } from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from './../../Header2/Header2';
const io = require("socket.io-client");
import axios from 'axios';
import Draggable from "react-draggable";

function Messages() {
  const { email } = useParams();
  const [contacts,setContacts] = useState([]);
  const [messages,setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const [contactVisible, setContactVisible] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
        if(response.data.length > 0){
          setContactVisible(response.data[0]);
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
    setMessages([...messages]);
  }

  function renderContacts() {
    return contacts.map((contact, index) => (
      <div className="contact" key={index} onClick={() => handleContactClick(contact)}>
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
      if (message.email2 == contactVisible.email && message.email1 == email || message.email1 == contactVisible.email &&  message.email2 == email){
        let messageClass="";
        if (message.email1 == email){
          messageClass = 'message-sent';
        }
        else{
          messageClass = 'message-received';
        }
        return (
          <div className={messageClass}>
            <p>
              <span className="sender">{message.email1}</span>
            </p>
            <p>{message.message}</p>
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

  return (
    <div>
      <Header2 activePage="messages" email={email} />
      <div className="messages">
        <div className="messages-content">
              <div className="message-list" >
                <Draggable axis="y" className="draggable-messages">
                <div>{renderMessages()}<div ref={messagesEndRef} /></div>
                </Draggable>
              </div>   
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
