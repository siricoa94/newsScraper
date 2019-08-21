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
  // Empty the Comments from the Comment section
  $("#Comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the Comment information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#Comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#Comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new Comment body
      $("#Comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new Comment, with the id of the article saved to it
      $("#Comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

      // If there's a Comment in the article
      if (data.Comment) {
        // Place the title of the Comment in the title input
        $("#titleinput").val(data.Comment.title);
        // Place the body of the Comment in the body textarea
        $("#bodyinput").val(data.Comment.body);
      }
    });
});

// When you click the saveComment button
$(document).on("click", "#saveComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the Comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from Comment textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the Comments section
      $("#Comments").empty();
    });

  // Also, remove the values entered in the input and textarea for Comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
