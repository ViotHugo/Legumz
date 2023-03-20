const mongoose = require('mongoose');

function inscription_dB(personneInscrire){
    return mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');

    // Récupérer la collection Personne
    const Users = mongoose.connection.collection('Users');

    // Ajouter une personne à la collection
    Users.insertOne(personneInscrire)
      .then((result) => {
        console.log('User add :', result.insertedId);

        // Récupérer tous les documents de la collection Personne
        Users.find({})
          .toArray()
          .then((resultats) => {
            console.log('Users :', resultats);
            mongoose.connection.close();
          })
          .catch((err) => {
            console.log(err);
            mongoose.connection.close();
          });
      })
      .catch((err) => {
        console.log(err);
        mongoose.connection.close();    
      });
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
  });
}

module.exports = { inscription_dB };