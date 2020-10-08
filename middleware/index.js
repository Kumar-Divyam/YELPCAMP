//all middlewares

/* 3 syntaxes are available
1 --------------------------
      var middlewareObj ={};

      middlewareObj.checkCampgroundOwnership = function(){
          //func body
      }
      middlewareObj.checkCommentOwnership = function(){
          //func body
      }

      module.exports = middlewareObj;
---------------------------
2--------------------------
var middlewareObj ={

    checkCampgroundOwnership = function(){
        //func body
    }
    checkCommentOwnership = function(){
        //func body
    }
};

module.exports = middlewareObj;
----------------------------
3----------------------------
module.exports = {
    checkCampgroundOwnership = function(){
        //func body
    }
    checkCommentOwnership = function(){
        //func body
    }
}
-----------------------------
*/
var campground = require("../models/campground"),
    Comment    = require("../models/comment");

var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground NOT FOUND...!!");
                res.redirect("back");
            } else {
                /*  foundCampground.author.id -> is a mongoose object
                    req.user._id -> is a string 
                    so we cannot use '===' ,also using '==' is not correct
                    we use here method provided by mongoose 
                 */
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You are unauthorized...!!");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in .....!!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment NOT FOUND...!!");
                res.redirect("back");
            } else {
                /*  foundComment.author.id -> is a mongoose object
                    req.user._id -> is a string 
                    so we cannot use '===' ,also using '==' is not correct
                    we use here method provided by mongoose 
                 */
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You are unauthorized...!!");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in .....!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first..!");//it flashes in the next page to render/redirect
    //here 'error'-> key(i.e a variable name)   'Please...' -> value
    res.redirect('/login');
}

module.exports = middlewareObj;