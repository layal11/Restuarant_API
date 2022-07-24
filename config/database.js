const mongoose = require("mongoose");

const { DB_CONN_STRING } = process.env;

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(DB_CONN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};