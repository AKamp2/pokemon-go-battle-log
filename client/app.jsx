const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const StatsTable = require('./stats.jsx');
const BattleForm = require('./battleform.jsx');
const BattleList = require('./battlelist.jsx');

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

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;