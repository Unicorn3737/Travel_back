const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  if (req.headers.authorization.split(" ")[0] === "Bearer") {
    const theToken = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(theToken, process.env.TOKEN_SECRET);
    req.payLoad = data;
    next();
  } else {
    res.status(403).json({ message: "headers malfomed" });
  }
};
module.exports = authenticateUser;
