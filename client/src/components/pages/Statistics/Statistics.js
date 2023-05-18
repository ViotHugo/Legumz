import React, { useEffect, useState } from 'react';
import Header from "./../../Header/Header";
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import "./Statistics.css"; 

function Statistics() {
<<<<<<< HEAD
  
=======
  const [stats, setStats] = useState({
    totInscrits: 0,
    totMatchs: 0,
    totMessages: 0,
    repartLegums: [0, 0, 0, 0],
    totMatchsAttentes: 0,
    totMatchsRefuses: 0
  });

>>>>>>> aa3c5f76b185ed0b5a26b4d8689d0a10949e84a2
  useEffect(() => {
    axios.post('http://localhost:5000/statistiques', {})
      .then((response) => {
        setStats(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const legumeLabels = ['🥕', '🌶️', '🍆', '🌽'];

  const matchData = [
    { name: 'Total', matches: stats.totMatchs },
    { name: 'En attente', matches: stats.totMatchsAttentes },
    { name: 'Refusés', matches: stats.totMatchsRefuses },
  ];

  const legumeData = stats.repartLegums.map((item, index) => (
    { name: legumeLabels[index], value: item }
  ));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


  return (
    <div>
      <Header />
      <h1 id="statistics-title">Quelques chiffres</h1>
      <div className="statistics-container">
        <div className="column-container">
          <div className="statistics-card">
            <h3 className="total-inscrits">Total d'inscrits: {stats.totInscrits}</h3>
          </div>
          <div className="statistics-card">
            <h3 className="total-messages">Total de messages envoyés: {stats.totMessages}</h3>
          </div>
        </div>
        <div className="statistics-card" id="pie-chart-card">
          <h3>Répartition des légumes:</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={legumeData}
              cx={235}
              cy={150}
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
      <div className="statistics-card" id="bar-chart-card">
        <BarChart width={400} height={300} data={matchData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="matches" fill="#8884d8" />  // Ajusté à partir de "Matchs"
        </BarChart>
      </div>
    </div>
  </div>
);
}

export default Statistics;
