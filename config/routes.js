const app = require('./express.js');
const homePageHandler = require('../routes/homePage.js');
const authHandler = require('../routes/auth.js');
const playsHandler = require('../routes/plays.js');
const errorPage = require('../routes/404.js');

//require handlers;

app.use('/', homePageHandler);

app.use('/', authHandler);

app.use('/', playsHandler);

app.use('*', errorPage);





module.exports = app;