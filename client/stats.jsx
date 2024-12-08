const React = require('react');
const { useState, useEffect } = React;

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

  const fetchStats = async () => {
    try {
      const response = await fetch('/getUserStats');
      if (!response.ok) {
        console.error('Failed to fetch stats');
        return;
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
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

module.exports = StatsTable;
