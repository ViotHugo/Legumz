import React, { useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import './VegetableSelection.css';
import { useNavigate } from 'react-router-dom';
import Header from "./../../Header/Header";

const VegetableSelection = () => {
  const navigate = useNavigate();
  const [backgroundColor, setBackgroundColor] = useState('linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)');

  const handleBackgroundColorChange = (index) => {
    const gradients = [
        'linear-gradient(120deg, #FFA500 0%, #FFE5B4 100%)',
        'linear-gradient(120deg, #FFFF00 0%, #FFFFB4 100%)',
        'linear-gradient(120deg, #FF0000 0%, #FFB4B4 100%)',
        'linear-gradient(120deg, #800080 0%, #E6E6FA 100%)',
    ];
    setBackgroundColor(index >= 0 ? gradients[index] : 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)');
};

return (
  <div>
    <Header />
    <div className="spacer"></div>
    <div
      className="App-container"
      style={{ backgroundImage: backgroundColor, minHeight: "100vh" }}
    >
      <div className="vegetable-card-container">
        {[
          { title: "Carotte", description: "Pour cultiver une relation durable #Sérieux" },
          { title: "Poivron jaune", description: "Moments savoureux sans s'engager #AmisAvecAvantages" },
          { title: "Piment rouge", description: "Pour épicer sa vie d'une nuit #CeSoir" },
          { title: "Aubergine", description: "Pour des rencontres sensuelles et régulières #SexFriend" },
        ].map((item, index) => (
          <ImageCard
            key={index}
            title={item.title}
            description={item.description}
            index={index}
            onBackgroundColorChange={handleBackgroundColorChange}
          />
        ))}
      </div>
    </div>
  </div>
);
};

export default VegetableSelection;
