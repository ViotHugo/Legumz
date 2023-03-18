import React from 'react';
import './GenderCard.css';

function GenderCard(props) {
  const handleClick = () => {
    console.log(`Vous avez cliqué sur ${props.title}`);
  };

  return (
    <div className="GenderCard" onClick={props.onClick}>
      <img src={props.image} alt={props.title} />
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}

export default GenderCard;
