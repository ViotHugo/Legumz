import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapPage = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const searchInput = useRef();

  const handleSearch = async () => {
    const query = searchInput.current.value;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('Location not found. Please try another search.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('An error occurred while searching for the location. Please try again later.');
    }
  };

  const handleZoomIn = () => {
    // Zoom in logic
  };

  const handleZoomOut = () => {
    // Zoom out logic
  };

  return (
    <div>
      <h1>Map Page</h1>
      <div>
        <input type="text" ref={searchInput} placeholder="Search location" />
        <button onClick={handleSearch}>Search</button>
      </div>
      <MapContainer center={position} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A sample popup.<br />Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;

