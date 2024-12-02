const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);

  app.get('/getBattles', mid.requiresLogin, controllers.Battle.getBattles);

  app.get('/battlePage', mid.requiresLogin, controllers.Battle.battlePage);
  app.post('/addBattle', mid.requiresLogin, controllers.Battle.addBattle);

  app.post('/deleteBattle', mid.requiresLogin, controllers.Battle.deleteBattle);

  app.get('/getUserStats', mid.requiresLogin, controllers.Battle.getUserStats);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;