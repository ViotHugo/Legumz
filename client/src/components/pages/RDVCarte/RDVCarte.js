import React, { useEffect, useState,useRef } from 'react';
import './RDVCarte.css';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header2 from "./../../Header2/Header2";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
const io = require("socket.io-client");
import { useNavigate } from "react-router-dom";

function RDVCarte() {
    const { userContact } = useParams();
    const navigate = useNavigate();
    const parseduserContact = JSON.parse(userContact);
    const user = parseduserContact.user
    const email = user.email;
    const socketRef = useRef();
    const contact = parseduserContact.contact
    const address1 = [user.lat,user.lon];
    const address2 = [contact.lat,contact.lon];
    const defaultCenter = [(address1[0] + address2[0]) / 2, (address1[1] + address2[1]) / 2];
    const [places, setPlaces] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const bowlingIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%2387f45c&icon=sports_soccer&apiKey=4db5be4bc7e84880896db32e5d275816',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45],
    });
    const museumIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%23eff011&icon=museum&apiKey=4db5be4bc7e84880896db32e5d275816',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
    })
    const cinemaIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%23b700ff&icon=theaters&apiKey=4db5be4bc7e84880896db32e5d275816',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
    });
    const restaurantIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%23ff0000&size=large&icon=restaurant&apiKey=4db5be4bc7e84880896db32e5d275816',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
    });
    const barIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%230be7f8&icon=glass-martini&iconType=awesome&apiKey=4db5be4bc7e84880896db32e5d275816',
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
    })
    const icons = {
        "bowling_alley": bowlingIcon,
        "museum": museumIcon,
        "cinema" : cinemaIcon,
        "restaurant" : restaurantIcon,
        "bar" : barIcon
    };
    const handleDateChange = (e) => {
        const currentDate = new Date().toISOString().split('T')[0]; // Obtient la date actuelle
        const selected = e.target.value;
        if (selected >= currentDate) {
          setSelectedDate(selected);
        }
      };
    
      const handleTimeChange = (e) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // Obtient l'heure actuelle
        const selected = e.target.value;
        if (selected >= currentTime) {
          setSelectedTime(selected);
        }
      };

    useEffect(() => {
    const socket = io("http://localhost:5000/", {
        query: { email }
    });
    socketRef.current = socket;
        // Récupérer les informations sur les lieux touristiques depuis une API
        axios.post('http://localhost:5000/recupRDV', { address1 :address1,address2:address2,defaultCenter : defaultCenter})
            .then(response => {
                setPlaces(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    return () => {
      socket.disconnect();
    };
    }, []);
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
      };
      const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('fr-FR', options).replace(':', 'h');
      };
    const handleClick = (place) => {
        console.log('Lieu sélectionné:', place);
        console.log('Date sélectionnée:', formatDate(selectedDate));
        console.log('Heure sélectionnée:', formatTime(selectedTime));
        socketRef.current.emit('invitation',{user:user,contact:contact,rdv:{place:place,date : formatDate(selectedDate),heure:formatTime(selectedTime)}} );
        const data = {
            email: user.email,
            contactVisible: contact
          };
        const encodedData = encodeURIComponent(JSON.stringify(data));
        navigate('/messages/'+encodedData);
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
                        place.tags.name && place.tags.amenity &&
                        <Marker position={[place.lat, place.lon]} key={place.id} icon={icons[place.tags.amenity]} >
                            <Popup>
                            <h3>{place.tags.name}</h3>
                            {place.tags.amenity && <p>Type : {place.tags.amenity}</p>}
                            {place.tags['contact:website'] && <p>Site : <a href={place.tags['contact:website']}
                            target="_blank" rel="noopener noreferrer">{place.tags['contact:website']}</a></p>}
                            {place.tags.phone && <p>Téléphone : {place.tags.phone}</p>}
                            <div>
                            <label>Date:</label>
                            <input type="date" value={selectedDate} onChange={handleDateChange} />
                            </div>
                            <div>
                            <label>Heure:</label>
                            <input type="time" value={selectedTime} onChange={handleTimeChange} />
                            </div>
                            <button onClick={() => handleClick(place)}>Choisir ce lieu</button>
                            </Popup>
                        </Marker>
                        ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default RDVCarte;