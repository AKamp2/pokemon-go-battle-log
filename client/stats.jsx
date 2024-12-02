const React = require('react');
const { useState, useEffect } = React;

const StatsTable = () => {
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
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

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
              <tr key={league}>
                <td>{league}</td>
                <td>{stats[league].wins}</td>
                <td>{stats[league].losses}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

module.exports = stats;