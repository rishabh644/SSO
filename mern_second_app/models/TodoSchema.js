const mongoose = require("mongoose");
const validator = require("validator");

const todoSchema = new mongoose.Schema({
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
	todoList: [
		{
			task: {
				type: String,
				required: true,
			},
			completed: {
				type: Boolean,
				default: false,
			},
		},
	],
});

const Todo = new mongoose.model("Todolist", todoSchema);
module.exports = Todo;
