$(document).ready(function(){

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the comments from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the comment information to the page
    .then(function(data) {
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new comment body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button data-id=" + data._id + " id='savecomment'>Save comment</button>");
      console.log(data.Comment);

      // If there's a comment in the article
      if (data.Comment) {
        console.log(data.Comment.title);
        console.log(data.Comment.body);
        // Place the title of the comment in the title input
        $("#titleinput").val(data.Comment.title);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.Comment.body);
      }
    });
});

// When you click the savecomment button
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from comment textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      // Empty the comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletebutton", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "delcomment/" + thisId,

  }).then(function (data){
    $("#titleinput").val("");
    $("#bodyinput").val("");
    location.reload();
  });
});
});