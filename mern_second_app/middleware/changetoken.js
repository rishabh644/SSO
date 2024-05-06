const userdb = require("../models/userSchema");

const changetoken = async (req, res, next) => {
	try {
		const curtoken = req.headers.authorization;

		const tokenValid = await userdb.findOne({ token: curtoken });
		if (!tokenValid) {
			return res.status(401).json({ status: 401, error });
		} else {
			tokenValid.token = "invalid";
			tokenValid.save();
			next();
		}
	} catch (error) {
		res
			.status(401)
			.json({ status: 401, message: "Unauthorized no token provide" });
	}
};

module.exports = changetoken;
