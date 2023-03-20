import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageCard.css';
import image1 from '../../../images/carrote.png';
import image2 from '../../../images/poivron_jaune.png';
import image3 from '../../../images/piment.png';
import image4 from '../../../images/aubergine.png';

function ImageCard(props) {
  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/gender-selection/'+props.title);
  };

  const handleMouseEnter = () => {
    props.onBackgroundColorChange(props.index);
  };

  const handleMouseLeave = () => {
    props.onBackgroundColorChange(-1);
  };

  const images = [image1, image2, image3, image4];

  return (

    <div
      className="ImageCard"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={images[props.index]} alt={props.title} />
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
  );
}

export default ImageCard;
