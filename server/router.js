const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/app', mid.requiresLogin, controllers.Battle.battlePage);
  app.get('/stats', mid.requiresLogin, controllers.Battle.statsPage);

  app.get('/getBattles', mid.requiresLogin, controllers.Battle.getBattles);

  app.get('/battlePage', mid.requiresLogin, controllers.Battle.battlePage);
  app.post('/addBattle', mid.requiresLogin, controllers.Battle.addBattle);

  app.post('/deleteBattle', mid.requiresLogin, controllers.Battle.deleteBattle);

  app.get('/getUserStats', mid.requiresLogin, controllers.Battle.getUserStats);

  app.get('/getUsageData', mid.requiresLogin, controllers.Battle.getUsageData);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
