const React = require('react');
const { useState } = React;
const { createRoot } = require('react-dom/client');
const BattleForm = require('./battleform.jsx');
const BattleList = require('./battlelist.jsx');
const Loadouts = require('./loadouts.jsx');

const App = () => {
    const [reloadTrigger, setReloadTrigger] = useState(false);
    //we need a different state to toggle the loadouts view premium feature
    //https://react.dev/reference/react/useState
    const [showLoadouts, setShowLoadouts] = useState(false);
    const [playerPokemon, setPlayerPokemon] = useState(['', '', '']);

    const triggerReload = () => setReloadTrigger(!reloadTrigger);

    return (
        <div>
            <div className="premium-toggle">
                <label>
                    <input
                        type="checkbox"
                        checked={showLoadouts}
                        onChange={(e) => setShowLoadouts(e.target.checked)}
                    />
                    Premium
                </label>
            </div>

            {showLoadouts && (
                <div id="loadouts">
                    <Loadouts populatePlayerPokemon={setPlayerPokemon} />
                </div>
            )}

            <div id="logBattle">
                <BattleForm triggerReload={triggerReload} initialPlayerPokemon={playerPokemon} />
            </div>

            <div id="battles">
                <BattleList reloadBattles={reloadTrigger} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;

//<div id="stats">
//        <StatsTable reloadTrigger={reloadTrigger} />
//      </div>