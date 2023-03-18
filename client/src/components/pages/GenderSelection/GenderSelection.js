import React from 'react';
import GenderCard from './GenderCard';
import maleImage from '../../../images/homme.png';
import femaleImage from '../../../images/femme.png';
import bothImage from '../../../images/bi.png';
import './GenderSelection.css';

import { useNavigate } from 'react-router-dom';

function GenderSelection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h1>Choix du sexe</h1>
      <div className="gender-selection">
        <GenderCard
          title="Homme"
          image={maleImage}
          description="Description pour homme"
          onClick={handleClick}
        />
        <GenderCard
          title="Femme"
          image={femaleImage}
          description="Description pour femme"
          onClick={handleClick}
        />
        <GenderCard
          title="Les deux"
          image={bothImage}
          description="Description pour les deux"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default GenderSelection;
