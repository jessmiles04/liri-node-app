
var fs = require("fs");

//Connects key.js to run.js
var key = require("./key.js");

//requires twitter npm
var twitter = require("twitter");

//pulls twitter key from key.js
var client = new twitter(key.twitterFeed);

//requires request npm
var request = require("request");

//pulls required spotify npm
var spotify = require("spotify");

//Variables for user request for info
var userRequest = process.argv[2];
var itemRequest = process.argv[3];

theAsk(userRequest, itemRequest);


//Overlying function to choose what function the user wants to run
function theAsk(uR, iR){
    switch(uR){
        //for twitter
        case "tweeted":
            fetchTweets();
        break;
        
		//for OMDB
        case "movie-this":
            fetchOMDB(iR);
        break;

        //for spotify
        case "spotify-this":
            fetchSpotify(iR);
        break;

		//for do what it says
		case "do-what-it-says":
        fetchRandom(iR);
        break;
    }
}

//For getting the last 5 tweets (sorry, not actually a Twitter user)
function fetchTweets(){
    var tweetsLength;

    //Grab the most recent tweets
        var params = {screen_name: 'JessMiles2013'};
        client.get('statuses/user_timeline', function(error, tweets, response){
		if(error) {
			console.log("Everything working fine.");
		};


        //Go through tweets and return a set number
        tweetsLength = 0;

        for(var i=0; i<tweets.length; i++){
			tweetsLength ++;
		}
		if (tweetsLength > 5){
			tweetsLength = 5;
		}
		for (var i=0; i<tweetsLength; i++){
			console.log("Tweet " + (i+1) + " created on: " + tweets[i].created_at);
			console.log("Tweet " + (i+1) + " text: " + tweets[i].text);
			console.log("--------------------------------------------------------------");

			appendFile("Tweet " + (i+1) + " created on: " + tweets[i].created_at);
			appendFile("Tweet " + (i+1) + " text: " + tweets[i].text);
			appendFile("--------------------------------------------------------------");
		}
    }); //end of client.get function
}// Ends twitter function

function fetchOMDB(movieName){
	//If a movie was not typed it, default to the movie Clockwork Orange
	if (itemRequest == null){
		movieName = "Clockwork Orange";
	}

	var requestURL = "http://www.omdbapi.com/?t=" + movieName + "&tomatoes=true&y=&plot=short&r=json";

	request(requestURL, function (error, response, data){

		//200 response means that the page has been found and a response was received.
		if (!error && response.statusCode == 200){
			console.log("Working on that.");
		}
		console.log("---------------------------------------------");
        console.log(JSON.parse(data));
		console.log("The movie's title is: " + JSON.parse(data)["Title"]);
		console.log("The movie's release year is: " + JSON.parse(data)["Year"]);		
		console.log("The movie's rating is: " + JSON.parse(data)["imdbRating"]);
		console.log("The movie's plot: " + JSON.parse(data)["Plot"]);
        console.log("The actors are: " + JSON.parse(data)["Actors"]);
        console.log("It was shot in: " + JSON.parse(data)["Country"]);
		console.log("The movie's primary language is: " + JSON.parse(data)["Language"]);

		appendFile("---------------------------------------------");
		appendFile("The movie's title is: " + JSON.parse(data)["Title"]);
		appendFile("The movie's release year is: " + JSON.parse(data)["Year"]);		
		appendFile("The movie's rating is: " + JSON.parse(data)["imdbRating"]);
		appendFile("The movie's plot: " + JSON.parse(data)["Plot"]);
        appendFile("The actors are: " + JSON.parse(data)["Actors"]);
		appendFile("It was shot in: " + JSON.parse(data)["Country"]);
		appendFile("The movie's primary language is: " + JSON.parse(data)["Language"]);									
	});
}//ends OMDB function

//for Spotify
function fetchSpotify(song){

        spotify.search({ 
            type: 'track', 
            query: song, 
        }, function(err, data) {
                if ( err ) {
        console.log('Error occurred: ' + err);
                return;
            }
            var song = data.tracks.items[0];
 
    // Do something with 'data' 
    console.log(data.tracks.items[0].artists[0].name); //artist name
    console.log(data.tracks.items[0].name); //track name
    console.log(data.tracks.items[0].href); //link
    console.log(data.tracks.items[0].album.name); //album name

	//appends file to datalog    
	appendFile(data.tracks.items[0].artists[0].name); //artist name
    appendFile(data.tracks.items[0].name); //track name
    appendFile(data.tracks.items[0].href); //link
    appendFile(data.tracks.items[0].album.name); //album name


});
}//End of spotify function

//Truly random function that I don't totally get
function fetchRandom(){

fs.readFile("random.txt", "utf8", function(error, data) {
  // Prints the contents of random.txt
    console.log(data);
  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");
  // creates an array
  console.log(dataArr);
  //seperates the variables
  var command = dataArr[0]; //spotify command
  var title = dataArr[1]; //I want it that way (originally patches with quotation marks--remove marks in original file)
  console.log(command);
  console.log(title);
//Runs the ask program, should spotify song
  theAsk(command, title);
});
}//end random

//to append data to datalog.txt
function appendFile(dataToAppend){

	//Output all that happens into a .txt file
	fs.appendFile("datalog.txt", dataToAppend , function(err){

		//If an error occurs appending the log
		if (err){
			return console.log(err);
		}
	});
}//end Append