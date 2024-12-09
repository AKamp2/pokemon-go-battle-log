const React = require('react');
const helper = require('./helper.js');
const Usage = require('./usage.jsx');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


// Map so the table displays nicer looking league names than 'GreatLeague'
const leagueDisplayMap = {
  LittleCup: 'Little Cup',
  GreatLeague: 'Great League',
  UltraLeague: 'Ultra League',
  MasterLeague: 'Master League',
};

const StatsTable = ({ reloadTrigger }) => {
  const [stats, setStats] = useState({
    LittleCup: { wins: 0, losses: 0 },
    GreatLeague: { wins: 0, losses: 0 },
    UltraLeague: { wins: 0, losses: 0 },
    MasterLeague: { wins: 0, losses: 0 },
    totalWins: 0,
    totalLosses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/getUserStats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats.');
        }
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        helper.handleError('Error fetching stats.');
        console.error('Error fetching stats:', err);
      }
    };
  
    fetchStats();
  }, [reloadTrigger]);

  const totalRatio =
    stats.totalWins + stats.totalLosses > 0
      ? (stats.totalWins / (stats.totalWins + stats.totalLosses)).toFixed(2)
      : 'N/A';

  return (
    <div className="statsSection">
      <h2>Total Win/Loss Ratio: {totalRatio}</h2>
      <table className="statsTable">
        <thead>
          <tr>
            <th>League</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stats)
            .filter((key) => key !== 'totalWins' && key !== 'totalLosses')
            .map((league) => (
              //info on html tables (never used these)
              //https://www.w3schools.com/html/html_tables.asp
              <tr key={league}>
                <td>{leagueDisplayMap[league] || league}</td>
                <td>{stats[league].wins}</td>
                <td>{stats[league].losses}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const Stats = () => (
  <div>
    <h1>Stats Overview</h1>
    <StatsTable />
    <Usage />
  </div>
);

const init = () => {
  const root = createRoot(document.getElementById('stats'));
  root.render(<Stats />);
};

window.onload = init;
