const React = require('react');
const { useState, useEffect } = React;

//the layout for the usage table
//have to check if percentage is a number or not bc of placeholder values
const UsageTable = ({ usageData }) => (
    <table>
      <thead>
        <tr>
          <th>Pokemon</th>
          <th>Total Usage</th>
          <th>Percentage of Battles</th>
        </tr>
      </thead>
      <tbody>
        {usageData.map(({ name, count, percentage }) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{count}</td>
            <td>
              {typeof percentage === 'number' ? percentage.toFixed(2) + '%' : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

const Usage = () => {
  const [userUsage, setUserUsage] = useState([]);
  const [enemyUsage, setEnemyUsage] = useState([]);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch('/getUsageData');
        const data = await response.json();
        setUserUsage(data.user);
        setEnemyUsage(data.enemy);
      } catch (err) {
        console.error('Error fetching usage data:', err);
      }
    };

    fetchUsageData();
  }, []);

  return (
    <div>
      <h2>User Pokemon Usage</h2>
      <UsageTable usageData={userUsage} />
      <h2>Opponent Pokemon Usage</h2>
      <UsageTable usageData={enemyUsage} />
    </div>
  );
};

module.exports = Usage;