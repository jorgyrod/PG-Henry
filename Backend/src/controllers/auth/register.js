const { User } = require("../../db");
const { hashSync } = require("bcrypt");
const createJWT = require("./utils/createJWT");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser)
      return res.json({ status: "error", message: "email is already used" });

    const hashedPassword = hashSync(password, 10);
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: "user",
    });
    const sendUserInfo = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    const token = createJWT(user.id);
    res.json({
      status: "ok",
      user: sendUserInfo,
      token,
    });
  } catch (e) {
    res.status(400).json(e);
  }
};
module.exports = register;