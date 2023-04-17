require("dotenv").config();
module.exports = {
	// eslint-disable-next-line no-undef
	MONGODB_URI : process.env.MONGODB_URI,
	// eslint-disable-next-line no-undef
	MONGODB_TOKEN : process.env.MONGODB_TOKEN,
	// eslint-disable-next-line no-undef
	PORT : process.env.PORT,
	// eslint-disable-next-line no-undef
	JWT_SECRET : process.env.JWT_SECRET
};