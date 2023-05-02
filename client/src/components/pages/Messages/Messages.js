import React, { useState } from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from './../../Header2/Header2';

function Messages() {
  const { email } = useParams();

  const [contacts] = useState([
    // Remplacez ces données par les informations de vos contacts
    { email: 'contact1@example.com', imageUrl: 'https://example.com/image1.jpg' },
    { email: 'contact2@example.com', imageUrl: 'https://example.com/image2.jpg' },
    { email: 'contact3@example.com', imageUrl: 'https://example.com/image3.jpg' },
  ]);

  const [messages] = useState([
    {
      id: 1,
      type: 'received',
      sender: 'contact1@example.com',
      content: 'Salut ! Comment ça va ?',
    },
    {
      id: 2,
      type: 'sent',
      sender: 'you@example.com',
      content: 'Salut ! Ça va bien, et toi ?',
    },
    {
      id: 3,
      type: 'received',
      sender: 'contact1@example.com',
      content: 'Ça va bien aussi, merci ! Quoi de neuf ?',
    },
    {
      id: 4,
      type: 'sent',
      sender: 'you@example.com',
      content: "Pas grand-chose, je travaille sur un projet d'interface de chat.",
    },
    {
      id: 5,
      type: 'received',
      sender: 'contact1@example.com',
      content: "C'est génial ! J'adorerais en savoir plus.",
    },
  ]);

  function renderContacts() {
    return contacts.map((contact, index) => (
      <div className="contact" key={index}>
        <img
          src={contact.imageUrl}
          alt={contact.email}
          className="contact-image"
        />
        <span>{contact.email}</span>
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

  return (
    <div>
      <Header2 activePage="messages" email={email} />
      <div className="messages">
        <div className="messages-content">
          <div className="message-list">{renderMessages()}</div>
          <form className="new-message-form">
            <input
              type="text"
              className="new-message-input"
              placeholder="Tapez votre message..."
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
        <div className="messages-sidebar">{renderContacts()}</div>
      </div>
    </div>
  );}

export default Messages;
