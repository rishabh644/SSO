const userdb = require("../models/userSchema");

const authenticate = async (req, res, next) => {
	try {
		const curtoken = req.headers.authorization;

		const tokenValid = await userdb.findOne({ token: curtoken });
		if (!tokenValid) {
			return res.status(401).json({ status: 401, error });
		} else {
			req.gdata = tokenValid;
			next();
		}
	} catch (error) {
		res
			.status(401)
			.json({ status: 401, message: "Unauthorized no token provide" });
	}
};

module.exports = authenticate;
