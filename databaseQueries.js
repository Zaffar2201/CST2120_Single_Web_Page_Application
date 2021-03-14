//Import the express module
const mysql = require('mysql');


//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "parasto",
    debug: false
});

//Global variables
var queryError;
var errorMessage;

//Load all stories
async function loadAllStories(response) {
    //LoadStories query
    let sql = "SELECT * FROM userstories ORDER BY StoryDate DESC, StoryTime DESC";

    //Wrap the execution of the query in a promise
    let selectPromise = new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) { //Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            } else { //Resolve promise with results
                resolve(result);
            }
        });
    });

    try {
        //Execute promise and output result
        let stories = await selectPromise;

        response.send(JSON.stringify(stories));

    } catch (err) {

        //Send response with status 400 for errors
        response.status(400).json(err);
    }
}



//Load specific user stories
async function loadUserStories(username, response) {

    //Load story
    let sql = "SELECT userstories.StoryId,user.UserName,userstories.StoryTime,userstories.StoryDate,userstories.StoryDescription FROM userstories INNER JOIN user ON user.UserName = userstories.StoryUsername  WHERE userstories.StoryUsername = '" + username + "' ORDER BY userstories.StoryDate DESC, userstories.StoryTime DESC";

    //Wrap the execution of the query in a promise
    let selectPromise = new Promise((resolve, reject) => {
        connectionPool.query(sql, (err, result) => {
            if (err) { //Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            } else { //Resolve promise with results
                resolve(result);
            }
        });
    });

    try {
        //Execute promise and output result
        let currentUserStories = await selectPromise;

        //Check story length
        //Above query will output a result even for no stories( 0 result)
        if (currentUserStories.length == 0) {
            //Send error status
            response.status(400).json("{Error: No stories posted yet!}");

        } else {
            //Send story
            response.send(JSON.stringify(currentUserStories));

        }

    } catch (err) {
        //Display error on console
        console.error(JSON.stringify(err));
        //Send error status
        response.status(400).json("{Error: No stories posted yet!}");
    }




}


async function postUserStory(userPost, response) {

    //Post a new Story
    let sql = "INSERT INTO userstories (StoryUsername, StoryTime,StoryDate,StoryDescription) " +
        "       VALUES ('" + userPost.username + "', '" + userPost.time + "', '" + userPost.date + "', '" + userPost.post + "')";


    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) { //Check for errors

            errorMessage = "{Error: " + err + "}";
            //Check if there has been an error
            queryError = true;


        } else {
            //Display the result on console line
            console.log(JSON.stringify(result));
            queryError = false;


        }
    });


    //Used timeout to ensure query has been executed before sending any response
    // Another way instead of using promises
    setTimeout(() => {
        if (!queryError) {

            response.send("Story posted successfully!");
            //End the response
            response.end();
        } else {

            response.status(400).json(errorMessage);
            response.end();

        }
    }, 1000);
    //Execure after 1 second

}

//Check user credentials
async function authenticateUser(Username, Password, response) {
    connectionPool.query('SELECT * FROM useraccount WHERE UserName = ? AND UserPassword = ?', [Username, Password], function(error, results) {
        //Verify if there is a result
        if (results.length > 0) {
            //No reuslt found
            queryError = false;

        } else {
            //Result found, hence valid credentials
            queryError = true;
        }


    });


    //Used timeout to ensure query has been executed before sending any response
    // Another way instead of using promises
    setTimeout(() => {
        if (queryError) {
            //Error response
            response.status(400).json("{Error: Access denied!}");

        } else {
            //Good response with status 200
            response.send("Access granted!");

        }
    }, 1000);
}

async function registerNewUser(newUser, response) {

    //Build Insert query
    let sql = "INSERT INTO user (UserName, UserFullName,UserEmail,UserPhone) " +
        "       VALUES ('" + newUser.username + "', '" + newUser.name + "', '" + newUser.email + "', '" + newUser.phone + "')";


    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err) { //Check for errors

            errorMessage = "{Error: " + err + "}";

            queryError = true;

        } else {

            queryError = false;


        }

    });

    //Finish off the interaction.

    //Used timeout to ensure query has been executed before sending any response
    // Another way instead of using promises
    setTimeout(() => {
        if (!queryError) {

            response.send("{result: 'User has been added!'}");



            // Insert in useraccount table if no duplicate data exists
            connectionPool.query("INSERT INTO useraccount (UserName, UserPassword) " +
                "       VALUES ('" + newUser.username + "', '" + newUser.password + "')", (err, result) => {
                    if (err) { //Check for errors

                        console.error("Error executing query: " + JSON.stringify(err));

                    } else {
                        //Inform on console line
                        console.log("User has been added!");



                    }
                });

        } else {
            //Error due to duplicate data
            console.log(queryError);
            response.status(400).json(errorMessage);

            return;
        }
    }, 1000);


}






//Export the functions
module.exports.loadAllStories = loadAllStories;
module.exports.loadUserStories = loadUserStories;
module.exports.postUserStory = postUserStory;
module.exports.authenticateUser = authenticateUser;
module.exports.registerNewUser = registerNewUser;