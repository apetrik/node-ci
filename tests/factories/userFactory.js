const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = () => {
  const user = new User({ displayName: "name" }).save();
  return user;
};
