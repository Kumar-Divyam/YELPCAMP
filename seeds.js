var mongoose = require("mongoose");
var campground = require("./models/campground");
var Comment = require("./models/comment");
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", { useNewUrlParser: true });

var data =[
    {
        name: "Cloud Flare",
        image: "https://images.unsplash.com/photo-1599927260303-ea937f6a1beb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "hi  hi hi i i hi  hi ihiiiiiiii In the field of astronomy, the sky is also called the celestial sphere. This is an abstract sphere, concentric to the Earth, on which the Sun, Moon, planets, and stars appear to be drifting. The celestial sphere is conventionally divided into designated areas called constellations."
    },
    {
        name: "Sky's Symphony",
        image: "https://images.unsplash.com/photo-1599904182194-d519a3268229?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "ski ski skiii iiii skiiiiiiiiiiis....   In the field of astronomy, the sky is also called the celestial sphere. This is an abstract sphere, concentric to the Earth, on which the Sun, Moon, planets, and stars appear to be drifting. The celestial sphere is conventionally divided into designated areas called constellations. "
    },
    {
        name: "Pillow Pallete",
        image: "https://images.unsplash.com/photo-1599906630473-a8fc2b0fa0bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" ,
        description: "colors colors colorssssssss... ss.........   In the field of astronomy, the sky is also called the celestial sphere. This is an abstract sphere, concentric to the Earth, on which the Sun, Moon, planets, and stars appear to be drifting. The celestial sphere is conventionally divided into designated areas called constellations."
    }
]


function seedDB(){
    //removing all campgrounds
    campground.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("campgrounds remove");
                //add  campgrounds
            data.forEach(function(seed){
                campground.create(seed, function(err,Campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added a camp");
                        //create a comment
                        Comment.create(
                            {
                                text: "this place is awesome......!!!",
                                author: "jim"
                            },function(err,comment){
                                if(err){
                                    console.log(err);
                                }else{
                                    Campground.comments.push(comment);
                                    Campground.save();
                                    console.log("created a commment");
                                }

                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;