import React from 'react';
import GenderCard from './GenderCard';
import maleImage from '../../../images/homme.png';
import femaleImage from '../../../images/femme.png';
import bothImage from '../../../images/bi.png';
import './GenderSelection.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GenderSelection() { 
  const { vegetableChoice } = useParams();

  return (
    <div >
      <h1>Choix du sexe</h1>
      <div className="gender-selection">
        <GenderCard
          title="Homme"
          image={maleImage}
          vegetableChoice={vegetableChoice}
          description="Description pour homme"
        />
        <GenderCard
          title="Femme"
          image={femaleImage}
          vegetableChoice={vegetableChoice}
          description="Description pour femme"
        />
        <GenderCard
          title="Les deux"
          image={bothImage}
          vegetableChoice={vegetableChoice}
          description="Description pour les deux"
        />
      </div>
    </div>
  );
}

export default GenderSelection;
