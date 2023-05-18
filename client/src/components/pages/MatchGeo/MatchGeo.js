import React, { useEffect, useState, useRef } from 'react';
import './MatchGeo.css';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Header2 from "./../../Header2/Header2";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const UpdateMapPosition = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 13);
  return null;
};

const getCoordinates = async (address) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=1`
  );
  // Log the response
  console.log("Nominatim response", response);
  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    setPosition([parseFloat(lat), parseFloat(lon)]);
  }
};

function MatchGeo() {
    const { email } = useParams();
    const [position, setPosition] = useState([48.85341, 2.348800]); // Default coordinates of London
    const [locationName, setLocationName] = useState("");
    const [user, setUser] = useState({});
    const searchInput = useRef();

    useEffect(() => {
      axios.post('http://localhost:5000/recupProfile', {email : email})
          .then((response) => {
            setUser(response.data);
            // Let's suppose the address can be used to fetch the coordinates
            const address = response.data.adress;
            console.log("adresse",address);
            getCoordinates(address);
            // Use the address to fetch the coordinates
            axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=1`)
              .then((response) => {
                if (response.data && response.data.length > 0) {
                  const { lat, lon, display_name } = response.data[0];
                  setPosition([parseFloat(lat), parseFloat(lon)]);
                  setLocationName(display_name);

                } 
              })
              .catch((error) => {
                console.log("Error fetching coordinates:", error);
              });
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
              <Marker position={position}>
                <Popup>{"Mon emplacement"}</Popup>
              </Marker>
              <UpdateMapPosition position={position} />
            </MapContainer>
          </div>
        </div>
        
      );}

export default MatchGeo;
