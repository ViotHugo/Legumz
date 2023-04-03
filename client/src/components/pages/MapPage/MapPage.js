import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./MapPage.css";
import "leaflet/dist/images/marker-shadow.png";
import Header from "./../../Header/Header";

const UpdateMapPosition = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 13);
  return null;
};

const MapPage = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [locationName, setLocationName] = useState("");
  const searchInput = useRef();
  const mapRef = useRef();

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

  const handleZoomIn = () => {
    const map = mapRef.current;
    map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    map.zoomOut();
  };

  return (
    <div>
      <Header/>
    <div className="map-page">
      <h1>Carte</h1>
      <div className="search-bar">
        <input
          type="text"
          ref={searchInput}
          placeholder="Rechercher une localisation"
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>
      {/* <button onClick={handleZoomIn}>Zoom +</button>
      <button onClick={handleZoomOut}>Zoom -</button> */}
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={13}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributeurs'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{locationName || "Localisation par défaut"}</Popup>
        </Marker>
        <UpdateMapPosition position={position} />
      </MapContainer>
    </div>
    </div>
  );
};

export default MapPage;
