const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
// const _ = require("lodash");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const article = mongoose.model("article", articleSchema);

app.route("/articles")
.get(function(req,res){
  article.find({},function(err,foundarticles){
    res.send(foundarticles);
  });
})
.post(function(req,res){
  const newArticle = new article({
  title: req.body.title,
  content: req.body.content
});
newArticle.save(function(err){
  if(!err){
  res.send("Successfully added a new article");
}
  else{
  res.send(err);
}
});
})
.delete(function(req,res){
  article.deleteMany(function(err){
    if(!err)
    {
      res.send("Successfully deleted all articles.");
    }
    else{
      res.send(err);
    }
  });
});

app.listen(3000,function(){
  console.log("Server started on port 3000")
});



app.route("/articles/:articleTitle")
.get(function(req,res){
  article.findOne({title: req.params.articleTitle},function(err,foundarticles){
    if(foundarticles)
    {
      res.send(foundarticles);
    }
    else{
      res.send("No article was found");
    }
  });
})

.put(function(req,res){
  article.update({title: req.params.articleTitle},
  {
    title: req.body.title,
    content: req.body.content
  },
{
  overwrite: true
},
function(err){
  if(!err){
    res.send("Success");
  }
});
})
.patch(function(req,res){
  article.update({title: req.params.articleTitle},
  {
    $set: req.body
  },
function(err){
  if(!err){
    res.send("Success");
  }
});
})
.delete(function(req,res){
  article.findOneAndDelete({title: req.params.articleTitle},function(err){
    if(!err){
      res.send("Success");
    }
  });
});
