import React from 'react';
import Header from "./../../Header/Header";
import "./About.css";

function About() {
  return (
    <div>
      <Header/>
      <div className="About">
        <div className="header">
          <h1>Qui sommes-nous ?</h1>
          <p>Bienvenue chez Legumz, votre nouveau terrain de jeux pour des rencontres authentiques !</p>

          <p>Combien de fois vous est-il arrivé de swiper à droite, espérant une connexion, mais découvrant rapidement un décalage dans les attentes ? Vous n'êtes pas seuls. C'est pourquoi nous avons créé Legumz.</p>

          <p> 🤳🏻 FILTREZ PAR ENVIE </p>
          <p>Chacun recherche quelque chose de différent sur une application de rencontres : une relation durable, des moments savoureux sans engagement, une soirée pimentée ou des rencontres plus sensuelles. Chez Legumz, nous pensons que la transparence est la clé. Alors, nous avons traduit ces attentes en légumes pour faciliter la communication de vos envies.</p>

          <p>Découvrez comment cela fonctionne :</p>
          <div className="legume-list">
            <p>🥕 : Pour cultiver une relation durable #Sérieux</p>
            <p>🍋 : Pour épicer sa vie d'une nuit #CeSoir</p>
            <p>🍆 : Pour des rencontres sensuelles et régulières #SexFriend</p>
            <p>🌶️ : Moments savoureux sans s'engager #AmisAvecAvantages</p>
          </div>

          <p>Commencez à utiliser Legumz, choisissez votre légume et découvrez les envies des personnes autour de vous. Parcourez les profils et commencez votre récolte !</p>

          <p>Rejoignez Legumz aujourd'hui et commencez à faire des rencontres qui correspondent à vos envies. Parce qu'après tout, la vie est trop courte pour des rencontres qui ne vous ressemblent pas.</p>
        </div>
      </div>
    </div>
  );
}

export default About;
