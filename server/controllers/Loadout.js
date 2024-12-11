const models = require('../models');

const { Loadout } = models;

const addLoadout = async (req, res) => {
  const { name, pokemon } = req.body;

  if (!name || !pokemon || pokemon.length !== 3) {
    return res.status(400).json({ error: 'Loadout must have a name and exactly 3 Pokemon' });
  }

  try {
    // Create and save the new loadout
    const newLoadout = new Loadout({
      name,
      pokemon,
      owner: req.session.account._id,
    });

    await newLoadout.save();

    return res.status(201).json({ message: 'Loadout added successfully', loadout: newLoadout });
  } catch (err) {
    console.error('Error adding loadout:', err);
    return res.status(500).json({ error: 'Error adding loadout' });
  }
};

const getLoadouts = async (req, res) => {
  try {
    // Fetch loadouts owned by the logged-in user
    const loadouts = await Loadout.find({ owner: req.session.account._id }).lean().exec();

    return res.json({ loadouts });
  } catch (err) {
    console.error('Error fetching loadouts:', err);
    return res.status(500).json({ error: 'Error fetching loadouts' });
  }
};

module.exports = {
  addLoadout,
  getLoadouts,
};
