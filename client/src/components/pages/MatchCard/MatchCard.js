import './MatchCard.css';
import { useState } from 'react';
import carotte from '../../../images/carrote.png';
import poivron from '../../../images/poivron_jaune.png';
import piment from '../../../images/piment.png';
import aubergine from '../../../images/aubergine.png';
function MatchCard ({data,myhobbies}) {
  const imageLeg = {
    "Légume 1": carotte,
    "Légume 2": poivron,
    "Légume 3": piment,
    "Légume 4": aubergine,
  }

  const [legumImage, setLegumImage] = useState(imageLeg[data.vegetableChoice]);
  const [legumClass, setLegumClass] = useState('');
  
  const revelFruit = (event) => {
    
    setLegumImage(legumImage)
    setLegumClass('transition');
  }
  
  const cuisineClick = () => {
    alert("oui");
  }

  const compostClick = () => {
    alert("non");
  }

  return (
    <div className="card-container" onClick={() => setLegumClass(legumClass ? '' : 'transition')}>
      <div className={`card ${legumClass}`}>
        <div className="card-front">
            <div className='image_contenant'>
              <img src={data.profilePicture} alt="Image homme"/>
            </div>
            <div className="line-container">
              <span className="line-circle">
              <img
                src={imageLeg[data.vegetableChoice]}
                alt="Avatar"
                className={`image_cercle ${legumClass}`}
                onClick={revelFruit}/>
              </span>
            </div>
            <div className="devant_nom">
              <h1 class="reduce-margin">{data.prenom}, {data.age}</h1>
              <p>A {data.city}</p>
            </div>
        </div>
        <div className="card-back">
                <div className='description'>
                    <h2>{data.prenom}, {data.age}</h2>
                    <p>A {data.city}</p>
                </div>
                <div className="line-simple"> </div>
                <div className='description'>
                    <p>{data.bio}</p>
                    <p>
                        {data.interest}
                    </p>
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
            <div className='choix'>
              <button className="poubelle" onClick={compostClick}>Composter</button>
              <button className='cuisine' onClick = {cuisineClick}>En Cuisine</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
