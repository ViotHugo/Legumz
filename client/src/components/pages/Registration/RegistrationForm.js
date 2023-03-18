import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ajoutez cette importation
import "./RegistrationForm.css";
import logo from "../../Header/logo.png";

const LoginForm = () => {
  const navigate = useNavigate(); // Ajoutez cette ligne
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your authentication logic here
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="container">
      <div className="logo-container">
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
  );
};

export default LoginForm;
