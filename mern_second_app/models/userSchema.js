const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keysecret = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("not valid email");
			}
		},
	},

	token: {
		type: String,
		required: true,
	},
});

// hash password

// createing model
const userdb = new mongoose.model("Newapp", userSchema);

module.exports = userdb;

// if (this.isModified("password")) {    }
