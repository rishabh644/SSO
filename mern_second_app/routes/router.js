const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const myauthenticate = require("../middleware/myauthenticate");
const changetoken = require("../middleware/changetoken");
const Todo = require("../models/TodoSchema");

// for user registration

// user Login

router.post("/login", myauthenticate, async (req, res) => {
	try {
		const token = req.gtoken;
		const result = { token };
		return res
			.status(200)
			.json({ status: 200, message: "Login Successful", result });
	} catch (error) {
		return res
			.status(401)
			.json({ status: 401, message: "Unauthorized email inside login" });
	}
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
	const ValidUserOne = req.gdata;
	console.log(ValidUserOne);
	res.status(200).json({
		status: 200,
		message: "Token validation successful",
		ValidUserOne,
	});
});

// user logout

router.post("/settoken", async (req, res) => {
	const { myemail, mytoken } = req.body;
	console.log(req.body);
	console.log(myemail);
	console.log(mytoken);
	if (!myemail || !mytoken) {
		return res.status(422).json({ error: "Fill all the details" });
	}

	try {
		let user = await userdb.findOne({ email: myemail });

		if (!user) {
			user = new userdb({ email: myemail, token: mytoken });
			await user.save();
		} else {
			user.token = mytoken;
			await user.save();
		}

		return res.status(200).json({ message: "Token set successfully" });
	} catch (error) {
		console.error("Error setting token:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/logout", changetoken, async (req, res) => {
	try {
		res.clearCookie("usercookie", { path: "/" });

		res.status(201).json({ status: 201 });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

router.post("/resettoken", async (req, res) => {
	try {
		const { token } = req.body;
		console.log("my token");
		const reqtoken = token;
		console.log(reqtoken);
		if (!token) {
			return res.status(422).json({ error: "Fill all the details" });
		}

		let user = await userdb.findOne({ token: reqtoken });
		console.log("Check is user is there");
		console.log(user);

		if (user) {
			//console.log("inside-if");
			user.token = "invalid";
			//console.log("changed_user.token");
			console.log(user.token);
			await user.save();
			return res.status(200).json({ status: 200, msg: "reset success" });
		} else {
			return res
				.status(200)
				.json({ status: 200, msg: "no need to reset already reset" });
		}
	} catch (error) {
		return res.status(401).json({ status: 401, msg: "inside catch" });
	}
});

router.get("/getlist", async (req, res) => {
	try {
		const { email } = req.body;
		console.log(email);

		const todoList = await Todo.findOne({ email }).select("todoList");

		if (!todoList) {
			return res
				.status(401)
				.json({ status: 401, error: "Todo list not found" });
		}

		return res.status(200).json({ status: 200, todoList: todoList });
	} catch (error) {
		console.error("Erroe while getting todo list:", error);
		return res.status(401).json({ status: 401, error: "Todo list not found" });
	}
});

router.post("/addtodo", async (req, res) => {
	try {
		const { email, task } = req.body;

		const todo = await Todo.findOneAndUpdate(
			{ email },
			{ $push: { todoList: { task } } },
			{ new: true }
		);

		if (!todo) {
			return res
				.status(401)
				.json({ status: 401, error: "Todo list not found" });
		}

		return res.status(200).json({ status: 200, todoList: todo.todoList });
	} catch (error) {
		console.error("Error while adding todo:", error);
		res.status(401).json({ status: 401, error: "Internal server error" });
	}
});

router.post("/markcomplete", async (req, res) => {
	try {
		const { email, taskIndex, completed } = req.body;
		const todo = await Todo.findOne({ email });

		if (!todo) {
			return res
				.status(401)
				.json({ status: 401, error: "Todo list not found" });
		}

		todo.todoList[taskIndex].completed = completed;

		await todo.save();

		return res.status(200).json({ status: 200, todoList: to });
	} catch (error) {
		console.error("Error while updating todo:", error);
		res.status(401).json({ status: 401, error: "Internal server error" });
	}
});

router.post("/updatetodo", async (req, res) => {
	try {
		const { email, taskIndex, task } = req.body;
		const todo = await Todo.findOne({ email });

		if (!todo) {
			return res.status(401).json({ error: "Todo list not found" });
		}

		todo.todoList[taskIndex].task = task;

		await todo.save();

		res.json(todo.todoList);
	} catch (error) {
		console.error("Error while updating todo:", error);
		res.status(401).json({ error: "Internal server error" });
	}
});
module.exports = router;
