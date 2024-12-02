const models = require('../models');

const { Battle } = models;

// Render the app view
const battlePage = (req, res) => res.render('app');

// Create a new battle entry
const addBattle = async (req, res) => {
  if (!req.body.league || !req.body.playerPokemon || !req.body.enemyPokemon || !req.body.outcome) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.playerPokemon.length !== 3 || req.body.enemyPokemon.length !== 3) {
    return res.status(400).json({ error: 'You must select exactly 3 Pokémon for both player and enemy.' });
  }

  const battleData = {
    league: req.body.league,
    playerPokemon: req.body.playerPokemon,
    enemyPokemon: req.body.enemyPokemon,
    outcome: req.body.outcome,
    owner: req.session.account._id,
  };

  try {
    const newBattle = new Battle(battleData);
    await newBattle.save();
    return res.status(201).json({ battle: newBattle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while adding the battle.' });
  }
};

// Retrieve all battles for the logged-in user
const getBattles = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const battles = await Battle.find(query).lean().exec();

    return res.json({ battles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving battles!' });
  }
};

// Delete a battle entry
const deleteBattle = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Battle ID is required to delete a battle.' });
    }

    const accountId = req.session.account._id;

    const deletedBattle = await Battle.findOneAndDelete({
      _id: id,
      owner: accountId,
    }).exec();

    if (!deletedBattle) {
      return res.status(404).json({ error: 'Battle not found or does not belong to the current user.' });
    }

    return res.status(200).json({ message: 'Battle deleted successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while deleting the battle.' });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
    try {
      const query = { owner: req.session.account._id };
      const battles = await Battle.find(query).lean().exec();
  
      const stats = {
        LittleCup: { wins: 0, losses: 0 },
        GreatLeague: { wins: 0, losses: 0 },
        UltraLeague: { wins: 0, losses: 0 },
        MasterLeague: { wins: 0, losses: 0 },
        totalWins: 0,
        totalLosses: 0,
      };
  
      // Calculate stats
      battles.forEach((battle) => {
        const leagueStats = stats[battle.league];
        if (battle.outcome === 'Win') {
          leagueStats.wins += 1;
          stats.totalWins += 1;
        } else if (battle.outcome === 'Loss') {
          leagueStats.losses += 1;
          stats.totalLosses += 1;
        }
      });
  
      return res.json({ stats });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving user stats!' });
    }
  };

module.exports = {
  battlePage,
  addBattle,
  getBattles,
  deleteBattle,
  getUserStats,
};