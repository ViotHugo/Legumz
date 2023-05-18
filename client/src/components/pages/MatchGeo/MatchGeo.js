import React, { useEffect, useState } from 'react';
import './MatchGeo.css';
import { Link, useParams } from "react-router-dom"; // Importer Link pour créer un lien vers la page Modifprofil.js
import axios from 'axios';
import Header2 from "./../../Header2/Header2";


function MatchGeo() {
    const { email } = useParams();
  return (
    <div>
      <Header2 activePage="matchgeo" email={email} />
    </div>
    
  );
}

export default MatchGeo;
