require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');

const config = require('./config/config.js')[env];
const app = require('./config/routes.js');

const startDBAndServer = async function () {
    await mongoose.connect(config.dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) {
            console.log(err.message);
            throw (err);
        }
        console.log('DB is up and running!');
    });

    app.listen(config.port, console.log(`Server is listening on port:${config.port}! Now write some code!`));
}

startDBAndServer();
