var express = require("express");

var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");


var PORT = process.env.PORT || 3000;

var app = express();



app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("https://www.ebaumsworld.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".featureFeedDetails").each(function(i, element) {
      var result = {};

      result.title = $(this).find("h2").children("a").text().trim();
      result.link = $(this).find("h2").children("a").attr("href")
      result.img = $(this).find(".featureDescription").text().trim();
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});
app.get("/", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle){
    console.log(dbArticle);
    var hbsObject = {
      article: dbArticle
    }
    res.render(__dirname + "/views/index.handlebars", hbsObject);
  }).catch(function(err){
    res.json(err);
  })
  
});
app.get("/articles", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});
app.get("/comments", function(req, res) {

  db.Comment.find({})
    .then(function(dbComment) {

      res.json(dbComment);
    })
    .catch(function(err) {

      res.json(err);
    });
});
app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })

    .populate("Comment")
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});
app.post("/articles/:id", function(req, res) {

  db.Comment.create(req.body)
    .then(function(dbComment) {

      return db.Article.findOneAndUpdate({ _id: req.params.id }, { Comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});
app.listen(PORT, function() {
  console.log("App running on http//:localhost:" + PORT);
});
