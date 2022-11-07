const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully Connected DB");
    })
    .catch((error) => {
      console.error(error);
      console.log("Unable to connect DB");
      process.exit(1);
    });
};
