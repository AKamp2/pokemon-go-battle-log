const React = require('react');
const helper = require('./helper.js');
const { useState, useEffect } = React;

// Map so the table displays nicer looking league names than 'GreatLeague'
const leagueDisplayMap = {
    LittleCup: 'Little Cup',
    GreatLeague: 'Great League',
    UltraLeague: 'Ultra League',
    MasterLeague: 'Master League',
  };

const BattleList = ({ reloadBattles, triggerReload }) => {
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    const loadBattlesFromServer = async () => {
      try {
        const response = await fetch('/getBattles');
        if (!response.ok) {
          throw new Error('Failed to fetch battles');
        }
        const data = await response.json();
        setBattles(data.battles);
      } catch (err) {
        console.error('Error loading battles:', err);
      }
    };

    loadBattlesFromServer();
  }, [reloadBattles]);

  const handleDelete = async (id) => {
    try {
      await helper.sendPost('/deleteBattle', { id }, () => {
        triggerReload(); // Reload data after successful deletion
      });
    } catch (err) {
      helper.handleError('Failed to delete battle.');
      console.error('Error deleting battle:', err);
    }
  };

  if (battles.length === 0) {
    return (
      <div className="battleList">
        <h3 className="emptyBattle">No Battles Logged Yet!</h3>
      </div>
    );
  }

  return (
    <div className="battleList">
      {battles.map((battle) => (
        <div key={battle._id} className="battle">
          <h3 className="battleLeague">League: {leagueDisplayMap[battle.league] || battle.league}</h3>
          <h3 className="playerPokemon">
            Player Pokemon: {battle.playerPokemon.join(', ')}
          </h3>
          <h3 className="enemyPokemon">
            Enemy Pokemon: {battle.enemyPokemon.join(', ')}
          </h3>
          <h3 className="battleOutcome">Outcome: {battle.outcome}</h3>
          <button
            onClick={() => handleDelete(battle._id)}
            className="deleteBattleButton"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

module.exports = BattleList;