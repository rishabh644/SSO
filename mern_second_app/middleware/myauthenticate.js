const userdb = require("../models/userSchema");

const myauthenticate = async (req, res, next) => {
	const { email } = req.body;
	console.log(email);

	if (!email) {
		res.status(422).json({ error: "fill all the details" });
	}

	try {
		const userValid = await userdb.findOne({ email: email });
		console.log(userValid);
		if (userValid) {
			const token = userValid.token;
			console.log(token);
			const ress = await fetch("http://localhost:8009/validuser", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			const data = await ress.json();
			console.log(data);
			if (data.status === 401 || !data) {
				return res
					.status(401)
					.json({ status: 401, message: "Re-login-require" });
			} else {
				res.cookie("usercookie", token, {
					expires: new Date(Date.now() + 9000000),
					httpOnly: true,
				});
				req.gtoken = token;
				next();
			}
		}
	} catch (error) {
		return res.status(401).json({ status: 401, message: "Unauthorized email" });
	}
};

module.exports = myauthenticate;
