if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// DATABASE
const dbUrl = process.env.ATLASDB_URL;

mongoose
    .connect(dbUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// APP CONFIG
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// SESSION STORE

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Mongo session store error", err);
});

const sessionOptions = {
    store,
    name: "session",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LOCALS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// LANDING PAGE
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ERROR HANDLER

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

// SERVER (RENDER SAFE)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
