const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

app.use(express.json({limit: '500mb'}))
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
    throw error;
  });

app.post('/inscription', (req, res) => {
  const personneInscrire = req.body
  // Récupérer la collection Personne
  const Users = mongoose.connection.collection('Users');
  // Ajouter une personne à la collection
  Users.insertOne(personneInscrire)
    .then((result) => {
      console.log('User add :', result.insertedId);
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();    
    });
});

app.post('/recupProfile', (req,res) => {
  const emailUser = req.body.email
  const Users = mongoose.connection.collection('Users');

  // Récupérer tous les documents de la collection Personne
  Users.find({email : emailUser})
      .toArray()
      .then((resultats) => {
        res.send(resultats[0])
        })
        .catch((err) => {
          console.log(err)
  });
})

app.post('/emailsUtilises', (req,res) => {
  const Users = mongoose.connection.collection('Users');
  Users.find({}, { email: 1 })
  .toArray()
  .then((resultats) => {
    const emails = resultats.map((user) => user.email);
    res.send(emails)
  })
  .catch((err) => {
    console.log(err);
  });
})

app.post('/recupMatchPossible', async (req,res)  => {
  const user = req.body.user; 
  const Users = mongoose.connection.collection('Users');
  const NoMatch = mongoose.connection.collection('NoMatch');
  const Match = mongoose.connection.collection('Match');
  const emailsToExclude = [user.email];

  try {
    const noMatchDocs = await NoMatch.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();
    const matchDocs = await Match.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();

    noMatchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    matchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    let resultats = await Users.find({ email: { $nin: emailsToExclude } }).toArray();
    //Enlever les profils dont le genre ne correspond pas
    if (user.genderSearch !== 'lesdeux') {
      resultats = resultats.filter((match) => match.gender == user.genderSearch || match.gender == "Les deux");
    } 
    // Trie par légume
    if(user.vegetableSearch){
      resultats = resultats.filter((match) => user.vegetableSearch.includes(match.vegetableChoice));
    }
    // Trie par age
    if(user.vegetableSearch){
      resultats = resultats.filter((match) => user.minAge<=match.age && match.age<=user.maxAge);
    }
 
    //Trie par distance
    if(user.distanceMax){
      resultats = resultats.filter((match) => calculDistance(match.adress, user.adress,user.distanceMax).then(distance => distance));
    }
    console.log(resultats)
/*
   
    
    if(hobbies){
      resultats.sort((a, b) => {
        if (a.vegetableChoice == b.vegetableChoice){
          const commonHobbiesA  = a.hobbies.filter((element) => hobbies.includes(element)).length;
          const commonHobbiesB  = b.hobbies.filter((element) => hobbies.includes(element)).length;
          if (commonHobbiesA > commonHobbiesB){
            return -1;
          }
          else if(commonHobbiesA < commonHobbiesB){
            return 1;
          }
          else{
            return 0;
          }
        }
      });
    }
    res.send(resultats);*/
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

app.post('/connexion', (req, res) => {
  const paramConnexion = req.body
  const Users = mongoose.connection.collection('Users');

  // Récupérer tous les documents de la collection Personne
  Users.find({email : paramConnexion.email , password : paramConnexion.password})
      .toArray()
      .then((resultats) => {
          if(resultats.length===0){
            res.send(false)
          }else{
            res.send(true)
          }
        })
        .catch((err) => {
          console.log(err)
          res.send(false)
  });
});

app.get('/',(req,res) => {
  res.send("hello")
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


function calculDistance(address1,address2,maxx){
  // Utiliser une promesse pour retourner la distance calculée
  return new Promise((resolve, reject) => {
    // Requête de géocodage pour l'adresse 1
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address1}`)
      .then(response => response.json())
      .then(data1 => {
        // Récupération des coordonnées de l'adresse 1
        const lat1 = data1[0].lat;
        const lon1 = data1[0].lon;
    
        // Requête de géocodage pour l'adresse 2
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address2}`)
          .then(response => response.json())
          .then(data2 => {
            // Récupération des coordonnées de l'adresse 2
            const lat2 = data2[0].lat;
            const lon2 = data2[0].lon;
    
            // Calcul de la distance en kilomètres
            const R = 6371; // Rayon de la terre en km
            const dLat = (lat2 - lat1) * Math.PI / 180; // Différence de latitude en radians
            const dLon = (lon2 - lon1) * Math.PI / 180; // Différence de longitude en radians
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
    
            // Renvoyer la distance calculée
            console.log(Math.ceil(distance), maxx)
            console.log(Math.ceil(distance)<=maxx)
            resolve(Math.ceil(distance)<=maxx);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}