import React from 'react';
import './GenderCard.css';
import { useNavigate } from 'react-router-dom';

function GenderCard(props) {
  const navigate = useNavigate();
  const handleClick = () => {
    const data = {
      vegetableChoice: props.vegetableChoice,
      genre: props.title
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    navigate('/signup/'+encodedData);
  };

  return (
    <div className="GenderCard" onClick={handleClick}>
      <img src={props.image} alt={props.title} />
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}

export default GenderCard;
