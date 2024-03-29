import React, { useEffect, useState, useRef } from 'react';
import './MatchGeo.css';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Header2 from "./../../Header2/Header2";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customIcon = (imageURL) => new L.Icon({
  iconUrl: imageURL,
  iconSize: [50, 50], // nouvelle taille de l'icône
  iconAnchor: [25, 25], // point de l'icône qui sera placé exactement à la position du marqueur
  popupAnchor: [0, -25] // point à partir duquel le popup s'ouvre
});

const UpdateMapPosition = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 13);
  return null;
};

function MatchGeo() {
    const { email } = useParams();
    const [position, setPosition] = useState([48.85341, 2.348800]); // Default coordinates of Paris
    const [locationName, setLocationName] = useState("");
    const [user, setUser] = useState({});
    const [matchs, setMatchs] = useState([]); // New state for storing matches
    const searchInput = useRef();

    useEffect(() => {
      axios.post('http://localhost:5000/recupProfile', {email : email})
        .then((response) => {
          setUser(response.data);
          const lat = parseFloat(response.data.lat);
          const lon = parseFloat(response.data.lon);
          setPosition([lat, lon]);
        })
        .catch((error) => {
          console.log(error);
        });

      // New API call for getting matches
      axios.post('http://localhost:5000/recupMatchs', {email: email})
        .then((response) => {
          setMatchs(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

    }, [email]);

  const handleSearch = async () => {
    const query = searchInput.current.value;
  
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );
  
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setLocationName(display_name);
      } else {
        alert(
          "Localisation non trouvée. Veuillez essayer une autre recherche."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de la localisation:", error);
      alert(
        "Une erreur s’est produite lors de la recherche de la localisation. Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <div>
      <Header2 activePage="matchgeo" email={email} />
      <div className="map-container">
        <h1>Carte</h1>
        <div className="search-bar">
          <input
            type="text"
            ref={searchInput}
            placeholder="Rechercher une localisation"
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributeurs'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={redIcon}>
            <Popup>{"Mon emplacement"}</Popup>
          </Marker>
          {
            // Markers for each match
            matchs.map((match, index) => {
              const lat = parseFloat(match.lat);
              const lon = parseFloat(match.lon);
              return (
                /*<Marker key={index} position={[lat, lon]}>
                  <Popup>{match.firstName}</Popup>
              </Marker>*/
              <Marker key={index} position={[lat, lon]} icon={customIcon(match.profilePicture)}>
                <Popup>{match.firstName}</Popup>
              </Marker>
              );
            })
          }
          <UpdateMapPosition position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

export default MatchGeo;
