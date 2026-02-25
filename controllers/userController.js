const User = require("../models/User.js")
const Recipe = require("../models/Recipe.js")

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const recipes = await Recipe.find({ author: user._id })
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: recipes,
    }

    // res.send(data)
    res.render("./users/profile.ejs", { user: data })
  } catch (error) {
    console.error("Error in getting user information ", error.message)
  }
}

module.exports = {
  getUserById,
}
