const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");
const server= http.createServer(app)
const axios = require('axios');

app.use(express.json({limit: '500mb'}))
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  transports: ['websocket', 'polling'],
  credentials: true
};

app.use(cors(corsOptions));
const io = new Server(server,{
  cors : corsOptions
})
app.use(express.json());



io.on("connection", (socket) => {
  const email = socket.handshake.query.newEmail;
  socket.join(email);
  socket.on('message', (messageData) => {
    socket.to(messageData.email2).emit('message', messageData);
    const Messages = mongoose.connection.collection('Messages');
    Messages.insertOne(messageData)
    .then((result) => {
      console.log(email)
      console.log('Message ajouté :',result.insertedId);
    })
    .catch((err) => {
      console.log(err);
    });
  });
  socket.on('invitation', (messageData) => {
    const message = messageData.user.firstName + " vous invite à aller à ce lieu : "+ messageData.rdv.place.tags.name;
    const latitude = messageData.rdv.place.lat;
    const longitude = messageData.rdv.place.lon;
   
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const address = data.address;
      const street = address.road || '';
      const houseNumber = address.house_number || '';
      const postalCode = address.postcode || '';
      const city = address.city || address.town || '';
      const country = address.country || '';
      const addressFinal = `${houseNumber} ${street}, ${postalCode} ${city}, ${country}`;
      const invitation = {email1:messageData.user.email,email2:messageData.contact.email,message:message,lieu : addressFinal,
        type : messageData.rdv.place.tags.amenity, heure:messageData.rdv.heure , date:messageData.rdv.date}
      socket.to(messageData.contact.email).emit('message', invitation);
      const Messages = mongoose.connection.collection('Messages');
      Messages.insertOne(invitation)
      .then((result) => {
        console.log('Message ajouté :',result.insertedId);
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch(error => {
      console.error('Error while fetching address:', error);
      return '';
    });
    
  });
})

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// Connexion à MongoDB
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB Atlas :', error);
    throw error;
  });

app.post('/inscription', async (req, res) => {
    const personneInscrire = req.body;
    try {
      const coords = await apiGeocoding(personneInscrire.adress);
      personneInscrire.lon = coords.longitude;
      personneInscrire.lat = coords.latitude;
      const city = await getCityFromCoordinates(coords.latitude, coords.longitude);
      personneInscrire.city = city;
      const Users = mongoose.connection.collection('Users');
      const result = await Users.insertOne(personneInscrire);
      console.log('User add :', result.insertedId);
      res.send(true);
    } catch (err) {
      console.log(err);
    }
});

app.post('/modifProfile', (req, res) => {
  const updateprofil = req.body
  delete updateprofil._id;
  // Récupérer la collection Personne
  
  const Users = mongoose.connection.collection('Users');
  // Ajouter une personne à la collection
  Users.updateOne({email:updateprofil.email},{$set:updateprofil})
    .then((result) => {
      console.log('User modif :');
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/modifRecherche', (req, res) => {
  const updateprofil = req.body
  const Users = mongoose.connection.collection('Users');

  Users.findOne({email:updateprofil.email})
    .then((result) => {
      let newProfile = result;
      if (updateprofil.vegetableSearch.length>0){ newProfile.vegetableSearch = updateprofil.vegetableSearch; }
      if(updateprofil.genderSearch!=''){ newProfile.genderSearch = updateprofil.genderSearch}
      newProfile.distanceMax = updateprofil.distanceMax;
      newProfile.minAge = updateprofil.minAge;
      newProfile.maxAge = updateprofil.maxAge;
      //modification du profil
      Users.updateOne({email:updateprofil.email},{$set:newProfile})
    .then((result) => {
      res.send(true);
    })
    .catch((err) => {
      console.log(err);
    });
    })
    .catch((err) => {
      console.log(err);
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

app.post('/recupMatchs', (req,res) => {
  const emailUser = req.body.email
  const Match = mongoose.connection.collection('Match');
  const Users = mongoose.connection.collection('Users');

  Match.find({  $or: [{ email1: emailUser }, { email2: emailUser }]})
    .toArray()
    .then((matches) => {
      const emailList = matches.reduce((acc, match) => {
        if (match.email1 !== emailUser) {
            acc.push(match.email1);
        }
        if (match.email2 !== emailUser) {
            acc.push(match.email2);
        }
        return acc;
    }, []);
    Users.find({ email: { $in: emailList } })
        .toArray()
        .then((users) => {
          res.send(users);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('Erreur serveur');
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Erreur serveur');
    });
})

app.post('/recupMessages', (req,res) => {
  const emailUser = req.body.email
  const Messages = mongoose.connection.collection('Messages');

  Messages.find({  $or: [{ email1: emailUser }, { email2: emailUser }]})
    .toArray()
    .then((resultats) => {
      res.send(resultats);
    })
  .catch((err) => {
    console.log(err);
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

app.post('/noMatch', (req,res) => {
  try {
    const NoMatch = mongoose.connection.collection('NoMatch');
    const userEmail = req.body.userEmail;
    const dataEmail = req.body.dataEmail;
    const result = NoMatch.insertOne({email1 : userEmail, email2 : dataEmail });
    console.log('NoMatch add :', result.insertedId);
    res.send(true);
  } catch (err) {
    console.log(err);
  }
})

app.post('/MatchVerif', async (req, res) => {
  try {
    const WaitMatch = mongoose.connection.collection('WaitMatch');
    const Match = mongoose.connection.collection('Match');
    const userEmail = req.body.userEmail;
    const dataEmail = req.body.dataEmail;
    const match = await WaitMatch.findOne({ email1: dataEmail, email2: userEmail });
    if (match !== null){
      const resultWait = await WaitMatch.deleteOne({ email1: dataEmail, email2: userEmail });
      const resultMatch = await Match.insertOne({ email1: userEmail, email2: dataEmail });
      console.log('Match add :',resultMatch.insertedId)
      console.log('WaitMatch delete',resultWait)
      res.send(true);
    }
    else{
      const result = await WaitMatch.insertOne({ email1: userEmail, email2: dataEmail });
      console.log('WaitMatch add :',result.insertedId)
      res.send(false);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/recupMatchPossible', async (req,res)  => {
  const user = req.body.user; 
  const Users = mongoose.connection.collection('Users');
  const NoMatch = mongoose.connection.collection('NoMatch');
  const Match = mongoose.connection.collection('Match');
  const WaitMatch = mongoose.connection.collection('WaitMatch');
  const emailsToExclude = [user.email];

  try {
    const noMatchDocs = await NoMatch.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();
    const matchDocs = await Match.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();
    const WaitMatchDocs = await WaitMatch.find({ email1: user.email }, { _id: 0, email2: 1 }).toArray();

    noMatchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    matchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    WaitMatchDocs.forEach((doc) => {
      emailsToExclude.push(doc.email2);
    });

    let resultats = await Users.find({ email: { $nin: emailsToExclude } }).toArray();
    //Enlever les profils dont le genre ne correspond pas
    if (user.genderSearch !== 'Les deux') {
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
    if (user.distanceMax) {
      resultats = await filterByDistance(user, resultats);
    }
   
    //par hobbies
    if(user.hobbies){
      resultats.sort((a, b) => {
          const commonHobbiesA  = a.hobbies.filter((element) => user.hobbies.includes(element)).length;
          const commonHobbiesB  = b.hobbies.filter((element) => user.hobbies.includes(element)).length;
          if (commonHobbiesA > commonHobbiesB){
            return -1;
          }
          else if(commonHobbiesA < commonHobbiesB){
            return 1;
          }
          else{
            return 0;
          }
      
      });
    }
    res.send(resultats);
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


app.post('/statistiques', (req, res) => {
  const Users = mongoose.connection.collection('Users');
  const Match = mongoose.connection.collection('Match');
  const WaitMatch = mongoose.connection.collection('WaitMatch');
  const NoMatch = mongoose.connection.collection('NoMatch');
  const Messages = mongoose.connection.collection('Messages');
  let stats = {
    totInscrits: 0,
    totMatchs: 0,
    totMessages: 0,
    repartLegums: [0, 0, 0, 0],
    totMatchsAttentes: 0,
    totMatchsRefuses: 0,
    villes : {},
    age : {},
    sexualite : {"Bisexuelle" : 0,"Hétérosexuelle" : 0, "Homosexuelle":0},
    hobbies : {}
  };

  // Promesse pour récupérer les utilisateurs
  const getUsers = new Promise((resolve, reject) => {
    Users.find()
      .toArray()
      .then((resultats) => {
        stats.totInscrits = resultats.length;
        const cityCounts = {};
        const hobbiesCounts = {};
        resultats.forEach((result) => {
          if (result.vegetableChoice == "Carotte") {
            stats.repartLegums[0]++;
          } else if (result.vegetableChoice == "Poivron jaune") {
            stats.repartLegums[1]++;
          } else if (result.vegetableChoice == "Piment rouge") {
            stats.repartLegums[2]++;
          } else {
            stats.repartLegums[3]++;
          }
            // Utiliser la variable "city" contenant le nom de la ville
            const city = result.city;
            if (cityCounts[city]) {
              cityCounts[city]++;
            } else {
              cityCounts[city] = 1;
            }

            // Utiliser la variable "age" contenant l'age
            const age = result.age;
            if (stats.age[age]) {
              stats.age[age]++;
            } else {
              stats.age[age] = 1;
            }
            // Utiliser la variable "sexualite" contenant l'age
            if(result.gender == result.genderSearch){
              stats.sexualite["Homosexuelle"]++
            }else if(result.genderSearch == "Les deux"){
              stats.sexualite["Bisexuelle"]++
            }
            else{
              stats.sexualite["Hétérosexuelle"]++
            }

            // Utiliser la variable "hobbies" contenant l'age
            const hobbies = result.hobbies;
            hobbies.forEach(function(hobby) {
              // Faites quelque chose avec l'élément du tableau
              if (hobbiesCounts[hobby]) {
                hobbiesCounts[hobby]++;
              } else {
                hobbiesCounts[hobby] = 1;
              }
            });
            
        });
        // Convertir le tableau d'objets en tableau de paires clé-valeur
        const cityCountsArray = Object.entries(cityCounts);
        const hobbiesCountsArray = Object.entries(hobbiesCounts);
        // Trier le tableau en fonction du nombre de personnes (par ordre décroissant)
        cityCountsArray.sort((a, b) => b[1] - a[1]);
        hobbiesCountsArray.sort((a, b) => b[1] - a[1]);
        // Assigner les villes triées à stats.villes
        stats.villes = cityCountsArray.reduce((acc, [city, count]) => {
          acc[city] = count;
          return acc;
        }, {});
        stats.hobbies = hobbiesCountsArray.reduce((acc, [hobby, count]) => {
          acc[hobby] = count;
          return acc;
        }, {});
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  // Promesse pour récupérer les messages
  const getMessages = new Promise((resolve, reject) => {
    Messages.find()
      .toArray()
      .then((resultats) => {
        stats.totMessages = resultats.length;
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  // Promesse pour récupérer les matchs
  const getMatchs = new Promise((resolve, reject) => {
    Match.find()
      .toArray()
      .then((resultats) => {
        stats.totMatchs = resultats.length;
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  // Promesse pour récupérer les matchs refusés
  const getNoMatchs = new Promise((resolve, reject) => {
    NoMatch.find()
      .toArray()
      .then((resultats) => {
        stats.totMatchsRefuses = resultats.length;
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  // Promesse pour récupérer les matchs en attente
  const getWaitMatchs = new Promise((resolve, reject) => {
    WaitMatch.find()
      .toArray()
      .then((resultats) => {
        stats.totMatchsAttentes = resultats.length;
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  // Attendre que toutes les promesses soient résolues
  Promise.all([getUsers, getMessages, getMatchs, getNoMatchs, getWaitMatchs])
    .then(() => {
      res.send(stats)
      console.log(stats.age)
    })
    .catch((err) => {
      console.log(err);
      res.status
    })
  })

app.post('/recupRDV',(req,res)=>{
  const address1 = req.body.address1;
  const address2 = req.body.address2; 
  const defaultCenter = req.body.defaultCenter; 
  const latitude = defaultCenter[0];
  const longitude = defaultCenter[1];

  try {
    // Requête à l'API Overpass pour récupérer les lieux de rendez-vous dans un rayon de 20 km
    axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];(node(around:20000,${latitude},${longitude})["amenity"="restaurant"];node(around:20000,${latitude},${longitude})["amenity"="bar"];node(around:20000,${latitude},${longitude})["amenity"="cinema"];node(around:20000,${latitude},${longitude})["amenity"="bowling_alley"];node(around:20000,${latitude},${longitude})["tourism"="museum"];);out;`)
  .then(response => {
    res.send(response.data.elements);
  })
  .catch(error => {
    console.error(error);
  });
    //const places = response.data.elements; // Liste des lieux de rendez-vous
    //res.send(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des lieux de rendez-vous.' });
  }
})
app.get('/',(req,res) => {
  res.send("hello")
});


// Fonction qui filtre les résultats à une distance inférieure ou égale à MAX_DISTANCE_KM km de l'utilisateur
async function filterByDistance(user, resultats) {
  const MAX_DISTANCE_KM = user.distanceMax; // maximum distance en kilomètres

  // Filtre les résultats qui sont à une distance inférieure ou égale à MAX_DISTANCE_KM km de l'utilisateur
  const filteredResults = resultats.filter((resultat, index) => {
    const distance = getDistance({ latitude: user.lat, longitude: user.lon }, { latitude: resultat.lat, longitude: resultat.lon });
    return distance <= MAX_DISTANCE_KM;
  });

  return filteredResults;
}

// Fonction qui calcule la distance en kilomètres entre deux coordonnées géographiques
function getDistance(coords1, coords2) {
  const R = 6371; // rayon moyen de la Terre en km
  const dLat = deg2rad(coords2.latitude - coords1.latitude);
  const dLon = deg2rad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1.latitude)) *
      Math.cos(deg2rad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Fonction qui convertit une valeur en degrés en radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Fonction qui appelle l'API OpenCage Geocoder pour obtenir les coordonnées correspondantes à une adresse
async function apiGeocoding(address) {
  const API_KEY = "b0c41ab27bf748b0853e17f8df3faaeb"; // clé d'API OpenCage Geocoder
  const API_URL = `https://api.opencagedata.com/geocode/v1/json?key=${API_KEY}&q=${encodeURIComponent(
    address
  )}&limit=1&no_annotations=1`; // URL de l'API avec les paramètres nécessaires

  try {
    const response = await fetch(API_URL); // appel à l'API avec fetch() (qui retourne une Promise)
    const data = await response.json(); // extraction des données JSON de la réponse
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry; // récupération des coordonnées
      return { latitude: lat, longitude: lng }; // retourne un objet avec les coordonnées
    } else {
      throw new Error("L'adresse n'a pas été trouvée"); // lance une erreur si l'adresse n'a pas été trouvée
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'appel à l'API de géocodage"); // lance une erreur en cas d'échec de l'appel à l'API
  }
}

async function getCityFromCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(url, { family: 4 });
    const city = response.data.address.city;
    console.log('Ville :', city);
    return city;
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
    throw error;
  }
}