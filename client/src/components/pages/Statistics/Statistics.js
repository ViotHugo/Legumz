import React,{ useEffect, useState } from 'react';
import Header from "./../../Header/Header";
import axios from 'axios';

function Statistics() {
  useEffect(() => {
    axios.post('http://localhost:5000/statistiques', {})
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <Header/>
    <div>
      <h1>Quelques chiffres</h1>
      <p>100% des mecs ont piné de la donzelles grace a nous.</p>
    </div>
    </div>
  );
}

export default Statistics;
