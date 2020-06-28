module.exports = {
    development: {
        port: process.env.PORT,
        privateKey: process.env.PRIVATE_KEY,
        dbURL: process.env.DB_URL
    },
    production: {}
};