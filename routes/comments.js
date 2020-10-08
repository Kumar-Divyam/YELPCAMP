var express = require("express");
var router  = express.Router({mergeParams: true});
var middleware = require("../middleware");


var campground = require("../models/campground"),
    Comment    = require("../models/comment");


//NEW COMMENTS
router.get("/new", middleware.isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, Campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: Campground});
        }
    });
});

//Post NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    //find campground by id
    campground.findById(req.params.id,function(err,Campground){
        if(err){
            console.log(err);
            redirect("/campgrounds");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong...!!");
                    console.log(err);
                }else{
                    //add username & id to comment
                    comment.author.username=req.user.username;
                    comment.author.id= req.user._id;
                    //save the comment
                    comment.save();
                    //connect comment to campground
                    Campground.comments.push(comment);
                    Campground.save();
                    req.flash("success", "Successfully added comment");
                    //redirect to campground show 
                    res.redirect("/campgrounds/" + Campground._id);
                }
            });
        }
    });
});

//COMMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

//COMMENT DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment DELETED");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;