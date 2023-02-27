
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    profileImg: String,
    friends: Array
});
const chatSchema = new mongoose.Schema({
    id: String,
    chat: Array
});

const Chat = mongoose.model("Chat", chatSchema);

const User = mongoose.model("User", userSchema);

module.exports = { User, Chat};