import React, { useEffect, useState } from 'react';
import Header from "./../../Header/Header";
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import "./Statistics.css"; 

function Statistics() {

  const [stats, setStats] = useState({
    totInscrits: 0,
    totMatchs: 0,
    totMessages: 0,
    repartLegums: [0, 0, 0, 0],
    totMatchsAttentes: 0,
    totMatchsRefuses: 0,
    villes : {},
    age : [],
    sexualite : {"Bisexuelle" : 0,"Heterosexuelle" : 0, "Homosexuelle":0},
    hobbies : {}
  });

  useEffect(() => {
    axios.post('http://localhost:5000/statistiques', {})
      .then((response) => {
  
        let villes = Object.entries(response.data.villes);
        villes.sort((a, b) => b[1] - a[1]);
        const topVilles = villes.slice(0, 3);
        const autres = villes.slice(3).reduce((total, [_, count]) => total + count, 0);
        topVilles.push(['Autres', autres]);
        let ageData = [];
        const ageMax = response.data.age ? Math.max(...Object.keys(response.data.age).map(Number)) : 0;

        for (let age = 18; age <= ageMax; age++) {
          const count = response.data.age && response.data.age[age.toString()] ? response.data.age[age.toString()] : 0;
          ageData.push({ name: age.toString(), value: count });
        }
        setStats({
          ...response.data,
          age:ageData,
          villes: topVilles,
          sexualite: response.data.sexualite
        });
  
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  const legumeLabels = ['🥕', '🌶️', '🍆', '🌽'];

  const sexualiteData = [
    { name: 'Hétérosexuelle', value: stats.sexualite['Hétérosexuelle'] || 0 },
    { name: 'Bisexuelle', value: stats.sexualite['Bisexuelle'] || 0 },
    { name: 'Homosexuelle', value: stats.sexualite['Homosexuelle'] || 0 },
  ];

  const matchData = [
    { name: 'Total', matches: stats.totMatchs },
    { name: 'En attente', matches: stats.totMatchsAttentes },
    { name: 'Refusés', matches: stats.totMatchsRefuses },
  ];

  const legumeData = stats.repartLegums.map((item, index) => (
    { name: legumeLabels[index], value: item }
  ));

  const COLORS = ['#F39F46', '#E3331E', '#6C0A76', '#D4D845'];


  return (
    <div>
      <Header />
      <h1 id="statistics-title">Quelques chiffres</h1>
      <div className="statistics-container">
        <div className="column-container">
          <div className="statistics-card2" >
            <h3 className="total-inscrits">Total d'inscrits: {stats.totInscrits}</h3>
          </div>
          <div className="statistics-card2" >
            <h3 className="total-messages">Total de messages envoyés: {stats.totMessages}</h3>
          </div>
        </div>
        <div className="statistics-card" id="pie-chart-card">
          <h3 className="chart-title">Répartition des légumes:</h3>
          <div className="chart-container">
            <PieChart width={400} height={400} className="center-chart">
              <Pie
                data={legumeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {
                  legumeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
        <div className="statistics-card" id="bar-chart-card">
          <h3>Les Matchs:</h3>
          <BarChart width={450} height={300} data={matchData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="matches" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="statistics-card" id="age-chart-card">
          <h3>Répartition par âge:</h3>
          <BarChart width={500} height={300} data={stats.age}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="statistics-card" id="villes-chart-card">
  <h3>Villes avec le plus d'inscrits:</h3>
  <BarChart width={500} height={300} data={stats.villes}>
    <XAxis dataKey="0" />
    <YAxis />
    <Tooltip />
    
    <Bar dataKey="1" fill="#8884d8" />
  </BarChart>
</div>


<div className="statistics-card" id="sexualite-chart-card">
  <h3>Répartition par sexualité :</h3>
  <div className="chart-container">
    <PieChart width={400} height={400} className="center-chart">
    <Pie
      data={sexualiteData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {sexualiteData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</div>
</div>





      </div>
    </div>
  );
}

export default Statistics;
