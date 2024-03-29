import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ajoutez cette importation
import "./RegistrationForm.css";
import logo from "../../Header/logo.png";
import axios from 'axios';
import Header from "./../../Header/Header";

const LoginForm = () => {
  const navigate = useNavigate(); // Ajoutez cette ligne
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your authentication logic here
    axios.post('http://localhost:5000/connexion', {email : email, password: password})
    .then((response) => {
      if (response.data){
        navigate('/profil/'+email);
      }
      else{
        setErrorMessage("L'email ou le mot de passe est incorrect.");
      }
      

    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <Header/>
    <div className="container">
      <div className="match-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Legumz</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="error-message">{errorMessage}</div>
          <div className="button-group">
            <button type="submit" className="connexion-button">
              Connexion
            </button>
            <button
              type="button"
              className="inscription-button"
              onClick={() => {
                // Redirect to the registration page
                navigate("/inscription"); // Mettez à jour cette ligne
              }}
            >
              Inscription
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
