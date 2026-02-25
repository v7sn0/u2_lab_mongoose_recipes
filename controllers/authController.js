const bcrypt = require("bcrypt")
const User = require("../models/User.js")

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.send("Username taken.")
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Passwords must match.")
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture,
    })

    res.send("Signed up successfully.")
  } catch (error) {
    console.error("Error in signing up ", error.message)
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.send("No user with that email.")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.send("Wrong password.")
    }

    req.session.user = {
      email: user.email,
      _id: user._id,
    }

    req.session.save(() => {
      res.send(`Thanks for signing in ${user.first}`)
    })
  } catch (error) {
    console.error("Error in signing in ", error.message)
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/")
    })
  } catch (error) {
    console.error("Error in signing out ", error.message)
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
}
