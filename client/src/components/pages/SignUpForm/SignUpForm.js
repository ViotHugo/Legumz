import React, { useState } from 'react';
import './SignUpForm.css';

function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    city: '',
    bio: '',
    interests: '',
    lookingFor: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="signup-container">
      <h1>Inscription</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Nom complet</label>
        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

        <label htmlFor="age">Âge</label>
        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />

        <label htmlFor="gender">Genre</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Choisir un genre</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="autre">Autre</option>
        </select>

        <label htmlFor="city">Ville</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />

        <label htmlFor="bio">Biographie</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required />

        <label htmlFor="interests">Intérêts</label>
        <input type="text" id="interests" name="interests" value={formData.interests} onChange={handleChange} required />

        <label htmlFor="lookingFor">Recherche</label>
        <input type="text" id="lookingFor" name="lookingFor" value={formData.lookingFor} onChange={handleChange} required />

        <label htmlFor="profilePicture">Photo de profil (URL)</label>
        <input type="url" id="profilePicture" name="profilePicture" value={formData.profilePicture} onChange={handleChange} required />

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default SignUpForm;
