function calculDistance(address1,address2){
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
              resolve(Math.ceil(distance));
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }

  const address1 = "1 rue de la Paix, Paris, France";
  const address2 = "Tour Eiffel, Paris, France";
  
  calculDistance(address1, address2).then(distance => console.log(distance));