var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
//here we nned not to mention filenames specifically but express automatically requires all contents of the DIRECTORY  

var campground = require("../models/campground"),
    Comment    = require("../models/comment");


//INDEX - show all campgrounds
router.get("/" , function(req,res){
    //unless user is logged-in it is undefined 
    //and when logged in username and id are inside the object but not the password
    campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("ERRoR");
        }else{
            res.render("../views/campgrounds/index" , {campgrounds: allcampgrounds, currentUser: req.user});
        }
    });
});

//CREATE - add new campground to db 
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image= req.body.image;
    var desc= req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price:price,image: image,description: desc, author: author };
    campground.create(newCampground,function(err,newadded){
            if(err){
                console.log(err);
            }else{
                res.redirect("/campgrounds");
        }
    });
});


//NEW - show form to create new campground 
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});


//SHOW - show more about given campground
router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    /* if(is user logged in?)
            true: {(is user own that campground)
                    true: allow edit
                    false: redirect}
            false: {redirect} */
    campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY   
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;