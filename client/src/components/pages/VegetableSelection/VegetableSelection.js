import React, { useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import { useNavigate } from 'react-router-dom';
import GenderSelection from '../GenderSelection/GenderSelection';


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
    <div className="App-container" style={{ backgroundImage: backgroundColor, minHeight: '100vh' }}>
      {Array(4)
        .fill()
        .map((_, index) => (
          <ImageCard
            key={index}
            title={`Légume ${index + 1}`}
            index={index}
            description={`Description du légume ${index + 1}`}
            onBackgroundColorChange={handleBackgroundColorChange}
          />
        ))}
    </div>
  );
};

export default VegetableSelection;
