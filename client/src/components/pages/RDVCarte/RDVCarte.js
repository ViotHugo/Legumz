import React, { useEffect, useState } from 'react';
import './RDVCarte.css';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header2 from "./../../Header2/Header2";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function RDVCarte() {
    const { userContact } = useParams();
    const parseduserContact = JSON.parse(userContact);
    const user = parseduserContact.user
    const contact = parseduserContact.contact
    const address1 = [user.lat,user.lon];
    const address2 = [contact.lat,contact.lon];
    const defaultCenter = [(address1[0] + address2[0]) / 2, (address1[1] + address2[1]) / 2];

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        // Récupérer les informations sur les lieux touristiques depuis une API
        axios.post('http://localhost:5000/recupRDV', { address1 :address1,address2:address2,defaultCenter : defaultCenter})
            .then(response => {
                setPlaces(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const handleClick = (place) => {
        console.log(place)
      } 
    return (
        <div>
            <Header2 activePage="messages" email={user.email} />
            <div className='map-container-RDV'>
                <MapContainer center={defaultCenter} zoom={13} style={{ height: "85vh", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {places.map(place => (
                        place.tags.name &&
                        <Marker position={[place.lat, place.lon]} key={place.id}>
                            <Popup>
                            <h3>{place.tags.name}</h3>
                            {place.tags.amenity && <p>Type : {place.tags.amenity}</p>}
                            {place.tags['contact:website'] && <p>Site : <a href={place.tags['contact:website']}
                            target="_blank" rel="noopener noreferrer">{place.tags['contact:website']}</a></p>}
                            {place.tags.phone && <p>Téléphone : {place.tags.phone}</p>}
                            <button onClick={handleClick(place)}>Choisir ce lieu</button>
                            </Popup>
                        </Marker>
                        ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default RDVCarte;