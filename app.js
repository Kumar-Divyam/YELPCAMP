var express    = require("express");
    methodOverride = require("method-override");
    bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    flash      = require("connect-flash");
    LocalStrategy = require("passport-local");
    User       = require("./models/user");
    app        = express();

const passport = require("passport");
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    

var campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//seedDB();

//passport configs
app.use(require("express-session")({
    secret: "The key to code and decode is this",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(flash());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to pass current user to all templates(use it after passport configs)

/* var sendCurUser = function (req, res, next) {
  res.locals.currentUser= req.user;
  next()
}
app.use(sendCurUser); */
            //OR
app.use(function(req, res, next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




//-----------------------------------------------
//listening
app.listen(4201,function(req,res){
    console.log("serving at port 4201...!!")
});