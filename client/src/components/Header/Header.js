import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "./logo.png";

function Header() {
  return (
    <header className="Header">
      <div className="Header-left">
        <img className="Header-logo" src={logo} alt="Logo" />
        <h1 className="Header-title">Legumz</h1>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" activeClassName="active" exact className="btn">
              Accueil
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/inscription" activeClassName="active" className="btn">
              Inscription
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/connexion" activeClassName="active" className="btn">
              Connexion
            </NavLink>
          </li>
          <li>
            <NavLink to="/map" activeClassName="active" exact className="btn">
              Carte géographique
            </NavLink>
          </li>
          <li>
            <NavLink to="/quisommesnous" activeClassName="active" className="btn">
              Qui sommes-nous
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistiques" activeClassName="active" className="btn">
              Statistiques
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
