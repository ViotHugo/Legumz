const mongoose = require('mongoose');

const uri = 'mongodb+srv://root:root@cluster0.uwibc8n.mongodb.net/Test?retryWrites=true&w=majority';
// Remplacez "<password>" par votre mot de passe MongoDB Atlas
// Remplacez "<dbname>" par le nom de votre base de données
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');

    // Récupérer la collection Personne
    const Personne = mongoose.connection.collection('Personne');

    // Ajouter une personne à la collection
    Personne.insertOne({ nom: 'Dupont', prenom: 'Jean', age: 30 })
      .then((result) => {
        console.log('Personne ajoutée :', result.insertedId);

        // Récupérer tous les documents de la collection Personne
        Personne.find({})
          .toArray()
          .then((resultats) => {
            console.log('Personnes :', resultats);
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



