const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

const { jwtDecode } = require("jwt-decode");

// for user registration

router.post("/register", async (req, res) => {
	const { fname, email, password, cpassword } = req.body;

	if (!fname || !email || !password || !cpassword) {
		res.status(422).json({ error: "fill all the details" });
	}

	try {
		const preuser = await userdb.findOne({ email: email });

		if (preuser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== cpassword) {
			res
				.status(422)
				.json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new userdb({
				fname,
				email,
				password,
				cpassword,
			});

			// here password hasing

			const storeData = await finalUser.save();

			// console.log(storeData);
			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log("catch block error");
	}
});

// user Login

router.post("/login", async (req, res) => {
	// console.log(req.body);

	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ error: "fill all the details" });
	}

	try {
		const userValid = await userdb.findOne({ email: email });

		if (userValid) {
			const isMatch = await bcrypt.compare(password, userValid.password);

			if (!isMatch) {
				res.status(422).json({ error: "invalid details" });
			} else {
				// token generate
				const token = await userValid.generateAuthtoken();
				//console.log(token);

				// cookiegenerate
				res.cookie("usercookie", token, {
					expires: new Date(Date.now() + 9000000),
					httpOnly: true,
				});

				const setTokenResponse = await fetch("http://localhost:8008/settoken", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ myemail: email, mytoken: token }),
				});

				if (!setTokenResponse.ok) {
					throw new Error("Failed to set token");
				} else {
					console.log("token set successfully");
				}
				const result = {
					userValid,
					token,
				};

				res.status(201).json({ status: 201, result });
			}
		}
	} catch (error) {
		res.status(401).json(error);
		console.log("catch block");
	}
});

// user Glogin

router.post("/glogin", async (req, res) => {
	const credential = req.body.Gresponse.credential;
	const password = req.body.Gresponse.clientId;

	console.log(credential);
	try {
		const decoded = jwtDecode(credential);
		console.log(decoded);
		const fname = decoded.given_name;
		const email = decoded.email;
		const password = decoded.nbf;
		const cpassword = password;

		const token24 = credential;

		console.log("Before register fetch");
		try {
			const userdelete = await userdb.findOne({ email: email });
			if (userdelete) {
				await userdb.deleteOne({ email: email });
				console.log("User deleted successfully");
			} else {
				console.log("User does not exitst");
			}
			const finalUser = new userdb({
				fname,
				email,
				password,
				cpassword,
			});

			const storeData = await finalUser.save();
			console.log("stored data");
			console.log(storeData);
		} catch (error) {
			console.log("Error in saving google user data");
		}
		try {
			const userValid = await userdb.findOne({ email: email });
			console.log(userValid);
			res.cookie("usercookie", token24, {
				expires: new Date(Date.now() + 9000000),
				httpOnly: true,
			});

			const setTokenResponse = await fetch("http://localhost:8008/settoken", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ myemail: email, mytoken: token24 }),
			});
			if (!setTokenResponse.ok) {
				throw new Error("Failed to set token");
			} else {
				console.log("token set successfully");
			}

			userValid.tokens = userValid.tokens.concat({ token: token24 });
			await userValid.save();

			console.log("After appending token");
			console.log(userValid);
			const token = token24;
			const result = {
				userValid,
				token,
			};

			res.status(201).json({ status: 201, result });
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		res.status(401).json({ status: 401, error: "Error outside main try" });
	}
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
	try {
		const ValidUserOne = await userdb.findOne({ _id: req.userId });
		res.status(201).json({ status: 201, ValidUserOne });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// user logout

router.get("/logout", authenticate, async (req, res) => {
	try {
		req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
			return curelem.token !== req.token;
		});

		const resetTokenResponse = await fetch("http://localhost:8008/resettoken", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token: req.token }),
		});

		if (!resetTokenResponse.ok) {
			console.log("resetToken Response not ok");
			throw new Error("Failed to reset token");
		} else {
			console.log("Token reset successfully");
		}
		res.clearCookie("usercookie", { path: "/" });
		req.rootUser.save();
		res.status(201).json({ status: 201 });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

module.exports = router;

// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true
