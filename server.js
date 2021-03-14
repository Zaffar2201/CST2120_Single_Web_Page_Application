//Import the appropriate modules
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./databaseQueries');

//The express module is a function. When it is executed it returns an app object
const app = express();
//Make use of bodyParser to use json strings
app.use(bodyParser.json());

//Set up express to serve static files from the directory called 'CW3-Web Application'
app.use(express.static('CW3-Web Application'));

//Start the app listening on port 8080
app.listen(8080);

//Set up application to handle both POST & GET requests sent to the user path

app.post('/register', registerNewUser);
app.post('/authenticate', processUserAuthentication);
app.post('/storyPost', processStoryPosting);
app.get('/stories', processAllStories);
app.get('/stories/*', processUserStories); //Returns user with specified ID



async function registerNewUser(request, response) {
    //Retrieve user details and store in newuser object
    let newUser = request.body;

    //Call registerNewUser function to store new user
    db.registerNewUser(newUser, response);

}

async function processUserAuthentication(request, response) {
    //Retrieve user credentials and store in userCredential object
    let userCredential = request.body;
    //Output the data on console screen
    console.log("Data received: " + JSON.stringify(userCredential));

    //Store username and password in appropriate variables
    let Username = request.body.username;
    let Password = request.body.password;

    //Call authenticateUser function to authenticate the user
    db.authenticateUser(Username, Password, response);


}



async function processAllStories(request, response) {
    //Call loadAllStories function to display all stories
    db.loadAllStories(response);
}


async function processUserStories(request, response) {

    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //Call loadUserStories function to display only current user story(ies)
    db.loadUserStories(pathEnd, response);

}


async function processStoryPosting(request, response) {
    //Retrieve user new posted story
    let userPost = request.body;

    //Call postUserStory to post a new story into database
    db.postUserStory(userPost, response);



}

//Export server for testing purposes
module.exports = app;