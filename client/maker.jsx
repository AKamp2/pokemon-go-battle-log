const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const StatsTable = require('./stats.jsx');

// Handle adding a new battle
const handleBattle = (e, onBattleAdded) => {
    e.preventDefault();
    helper.hideError();

    const league = e.target.querySelector('#battleLeague').value;
    const playerPokemon = [
        e.target.querySelector('#playerPokemon1').value,
        e.target.querySelector('#playerPokemon2').value,
        e.target.querySelector('#playerPokemon3').value,
    ];
    const enemyPokemon = [
        e.target.querySelector('#enemyPokemon1').value,
        e.target.querySelector('#enemyPokemon2').value,
        e.target.querySelector('#enemyPokemon3').value,
    ];
    const outcome = e.target.querySelector('#battleOutcome').value;

    if (!league || playerPokemon.includes('') || enemyPokemon.includes('') || !outcome) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { league, playerPokemon, enemyPokemon, outcome }, onBattleAdded);
    return false;
};

// Form for adding battles
const BattleForm = (props) => (
    <form
        id="battleForm"
        onSubmit={(e) => handleBattle(e, props.triggerReload)}
        action="/addBattle"
        method="POST"
        className="battleForm"
    >
        <div>
            <h2>Log Battle</h2>
            <label htmlFor="league">League: </label>
            <select id="battleLeague" name="league">
                <option value="">Select a League</option>
                <option value="LittleCup">Little Cup</option>
                <option value="GreatLeague">Great League</option>
                <option value="UltraLeague">Ultra League</option>
                <option value="MasterLeague">Master League</option>
            </select>
        </div>
        <div>
            <h3>Player Pokémon:</h3>
            <input id="playerPokemon1" type="text" placeholder="Pokémon 1" />
            <input id="playerPokemon2" type="text" placeholder="Pokémon 2" />
            <input id="playerPokemon3" type="text" placeholder="Pokémon 3" />
        </div>
        <div>
            <h3>Enemy Pokémon:</h3>
            <input id="enemyPokemon1" type="text" placeholder="Pokémon 1" />
            <input id="enemyPokemon2" type="text" placeholder="Pokémon 2" />
            <input id="enemyPokemon3" type="text" placeholder="Pokémon 3" />
        </div>
        <div>
            <label htmlFor="outcome">Outcome: </label>
            <select id="battleOutcome" name="outcome">
                <option value="">Select Outcome</option>
                <option value="Win">Win</option>
                <option value="Loss">Loss</option>
            </select>
        </div>
        <input className="makeBattleSubmit" type="submit" value="Log Battle" />
    </form>
);

// List of battles
const BattleList = (props) => {
    const [battles, setBattles] = useState([]);

    useEffect(() => {
        const loadBattlesFromServer = async () => {
            const response = await fetch('/getBattles');
            const data = await response.json();
            setBattles(data.battles);
        };
        loadBattlesFromServer();
    }, [props.reloadBattles]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch('/deleteBattle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to delete battle:', errorData.error);
                return;
            }

            props.triggerReload();
        } catch (error) {
            console.error('Error deleting battle:', error);
        }
    };

    if (battles.length === 0) {
        return (
            <div className="battleList">
                <h3 className="emptyBattle">No Battles Logged Yet!</h3>
            </div>
        );
    }

    const battleNodes = battles.map((battle) => (
        <div key={battle._id} className="battle">
            <h3 className="battleLeague">League: {battle.league}</h3>
            <h3 className="playerPokemon">Player Pokémon: {battle.playerPokemon.join(', ')}</h3>
            <h3 className="enemyPokemon">Enemy Pokémon: {battle.enemyPokemon.join(', ')}</h3>
            <h3 className="battleOutcome">Outcome: {battle.outcome}</h3>
            <button onClick={() => handleDelete(battle._id)} className="deleteBattleButton">
                Delete
            </button>
        </div>
    ));

    return <div className="battleList">{battleNodes}</div>;
};

// Main App Component
const App = () => {
    const [reloadTrigger, setReloadTrigger] = useState(false);

    const triggerReload = () => setReloadTrigger(!reloadTrigger);

    return (
        <div>
            <div id="logBattle">
                <BattleForm triggerReload={triggerReload} />
            </div>
            <div id="stats">
                <StatsTable reloadTrigger={reloadTrigger} />
            </div>
            <div id="battles">
                <BattleList reloadBattles={reloadTrigger} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

// Initialize the app
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;