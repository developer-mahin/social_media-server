const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now, },
  },
  { collection: 'usersData' }
)

const model = mongoose.model('user', User)

module.exports = model





// const mongoose = require("mongoose");
// const userSchema = mongoose.Schema({
//   useremail: {
//     type: String,
//     require: true,
//     unique: true,
//   },
//   username: {
//     type: String,
//     require: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     require: true,
//   },
//   createdOn: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.model("user", userSchema);
// module.exports = User;