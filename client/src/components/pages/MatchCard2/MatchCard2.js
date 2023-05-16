import './MatchCard2.css';
import { useState } from 'react';
import carotte from '../../../images/carrote.png';
import poivron from '../../../images/poivron_jaune.png';
import piment from '../../../images/piment.png';
import aubergine from '../../../images/aubergine.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MatchCard ({data,myhobbies,user}) {
  const navigate = useNavigate();
  const imageLeg = {
    "Carotte": carotte,
    "Poivron jaune": poivron,
    "Piment rouge": piment,
    "Aubergine": aubergine,
  }
  const distance = Math.round(getDistance({ latitude: user.lat, longitude: user.lon }, { latitude: data.lat, longitude: data.lon }));

  return (
    <div className='mainContainer'>
      <div className="theCard">
        <div className='theFront'>
          <div className='image_contenant'>
            <img src={data.profilePicture} alt="Image homme"/>
          </div>
          <div className="line-container">
            <span className="line-circle">
            <img
              src={imageLeg[data.vegetableChoice]}
              alt={`photo de ${data.firstName}`}
              className="image_cercle"/>
            </span>
          </div>
          <div className="devant_nom">
            <h1 class="reduce-margin">{data.firstName}, {data.age}</h1>
            <p className="distance">A {distance} km</p>
          </div>
        </div>
        <div className='theBack'>
          <div className='description'>
            <h2>{data.firstName}, {data.age}</h2>
            <p>A {distance} km</p>
          </div>
          <div className="line-simple"> </div>
          <div className='description'>
            <p>{data.bio}</p>
          </div>
          <div className="line-simple"> </div>
          <div className='description'>
            <div className="hobbies">
              {data.hobbies.map((hobby, index) => (
                <div className={`hobby ${myhobbies.includes(hobby) ? 'green' : ''}`} key={index}>
              {hobby}
            </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;


// Fonction qui calcule la distance en kilomètres entre deux coordonnées géographiques
function getDistance(coords1, coords2) {
  const R = 6371; // rayon moyen de la Terre en km
  const dLat = deg2rad(coords2.latitude - coords1.latitude);
  const dLon = deg2rad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1.latitude)) *
      Math.cos(deg2rad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Fonction qui convertit une valeur en degrés en radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}