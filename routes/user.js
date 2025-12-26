const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
.get(userController.rendersignUpForm)
.post(wrapAsync(userController.signup))


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login' , failureFlash : true}), userController.login)



router.get("/logout" , userController.logout)

module.exports = router;