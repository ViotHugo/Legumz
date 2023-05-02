
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
      <h2 className="card-title">{props.title}</h2> {/* Ajoutez la classe card-title ici */}
      <p className="card-description">{props.description}</p> {/* Ajoutez la classe card-description ici */}
    </div>
  );
  
}

export default GenderCard;
