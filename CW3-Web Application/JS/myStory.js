//This checks if a user is currently logged in
function checkUserSession() {

    //Checks sessionStorage length
    if (sessionStorage.length == 0) {
        //Display login modal to login fist
        lgmodal.style.display = "block";

        //Redirect to homepage if close login modal
        closelg.onclick = function() {
            lgmodal.style.display = "none";

            window.location.href = "/";
        }

    } else {
        //Call for current logged in user story(ies)
        requestCurrentUserStory()
    }

}
//Global variable
var globalCurrentUserStory;

function requestCurrentUserStory() {

    //Retrieves current logged in user from sessionStorage & stores in a variable
    let currentuser = sessionStorage.loggedInUsername;

    //Create request object 
    let request = new XMLHttpRequest();

    //Set up request with HTTP method and URL 
    request.open("GET", "/stories/" + currentuser + "", true);

    //Send request
    request.send();


    //Create event handler that specifies what should happen when server responds
    request.onload = () => {
        //Check HTTP status code
        if (request.status === 200 && request.readyState === 4) {
            //Store data from server into global variable

            //Stores responseTesxt(user stories) in a global variable
            globalCurrentUserStory = request.responseText;

            //Calls for display fucntion
            displayCurrentUserStory();



        } else
        //Display function
            displayCurrentUserStory();
    };

}

//This function displays stories of a specific user
function displayCurrentUserStory() {

    //Check for globalVariable value
    switch (globalCurrentUserStory == null) {

        //Case globalVariable is null
        case true:

            htmlStr = "";
            htmlStr += '<div id="post-story"><span style="font-family:Eater;font-size:18px;color:#94130b">No stories posted yet...</span></div>';
            htmlStr += ' <br style="clear: both">';
            htmlStr += ' <div id="author-post">';
            htmlStr += '<div id="author-form">';
            htmlStr += '<input class="author-story-input" type="text" id="story" name="story" placeholder="Post your story here..." autocomplete="off" size="57"><br>';
            htmlStr += '<div id="myStory-button"><button id="myStory-logout" onclick="logOut()">&nbsp;&nbsp;&nbsp;<span style="color:white;font-size: 18.5px;">Log out</span>&nbsp;&nbsp;&nbsp;</button><button  id="post-submit" onclick="postStory()">&nbsp;&nbsp;&nbsp;<span style="color:white;font-size: 18.5px;">Post</span>&nbsp;&nbsp;&nbsp;</button><br><br><br><br></div>';
            htmlStr += '<span class="submitting-text" id="confirmationText" style="margin-top:-10px;float:right;padding-right:33px;font-family:Eater;"></span><br><br><br>';
            htmlStr += '</div></div>';

            //Add all into a div string and display
            document.getElementById("mainUserStory").innerHTML = htmlStr;


            break;
        default:


            //Convert JSON response into array
            let storyArray = JSON.parse(globalCurrentUserStory);


            //Display form
            htmlStr = "";

            //Loop though end of array
            for (let i = 0; i < storyArray.length; i++) {

                htmlStr += '<div id="post">';
                htmlStr += '<div id="post-info">';
                htmlStr += '<div id="post-info-top">';
                htmlStr += '<img src="Images/paranormal.png" alt="account icon"></div>';
                htmlStr += ' <span style="padding-left:5px">' + storyArray[i].UserName + '</span><br>';
                htmlStr += '<span style="padding-left:5px;">Date:- ' + storyArray[i].StoryDate.substr(0, 10) + '</span><br>';
                htmlStr += '<span style="padding-left:5px;">Time:- ' + storyArray[i].StoryTime.substr(0, 5) + '</span><br></div>';
                htmlStr += '<div id="post-story">' + storyArray[i].StoryDescription + '</div>';
                htmlStr += ' <br style="clear: both">';
                htmlStr += '</div>';


            }

            htmlStr += ' <br><br>';
            htmlStr += ' <div id="author-post">';
            htmlStr += '<div id="author-form">';
            htmlStr += '<input class="author-story-input" type="text" id="story" name="story" placeholder="Post your story here..." autocomplete="off" size="57"><br>';
            htmlStr += '<div id="myStory-button"><button id="myStory-logout" onclick="logOut()">&nbsp;&nbsp;&nbsp;<span style="color:white;font-size: 18.5px;">Log out</span>&nbsp;&nbsp;&nbsp;</button><button id="post-submit" onclick="postStory()">&nbsp;&nbsp;&nbsp;<span style="color:white;font-size: 18.5px;">Post</span>&nbsp;&nbsp;&nbsp;</button><br><br><br><br></div>';
            htmlStr += '<span class="submitting-text" id="confirmationText" style="margin-top:-10px;float:right;padding-right:33px;font-family:Eater;"></span><br><br><br>';
            htmlStr += '</div></div>';


            //Add all into a div string and display
            document.getElementById("mainUserStory").innerHTML = htmlStr;


            break;



    }



}

// This function post a new story
function postStory() {
    //Link confitmtext DOM
    let confirmText = document.getElementById("confirmationText");

    //Checks if story is empty or less than 10 characters
    if (document.getElementById("story").value == "" || document.getElementById("story").value.length < 10) {

        //Inform user
        confirmText.style.color = "yellow";
        confirmText.innerHTML = "Please write atleast 10 characters!";
        setTimeout(() => {
            confirmText.innerHTML = "";
        }, 3500);






    } else {
        //call this function
        requestCurrentUserPostingStory();

    }


}

//This fucntion will post the story
function requestCurrentUserPostingStory() {

    //Retrieves today's date and time
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!`

    let yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    let finalDate = yyyy + '-' + mm + '-' + dd;
    let userPost = document.getElementById("story").value;

    let time = new Date();
    let finalTime = (time.toTimeString()).substr(0, 8);
    let confirmText = document.getElementById("confirmationText");



    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Create object with user data
    let storyObj = {
        username: sessionStorage.loggedInUsername,
        date: finalDate,
        time: finalTime,
        post: userPost

    };

    //Send new user data to server
    xhttp.open("POST", "/storyPost", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    //Data to be sent
    xhttp.send(JSON.stringify(storyObj));


    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {


        if (this.readyState == 4 && this.status == 200) {

            //Inform user if story has been posted
            document.getElementById("story").innerHTML = "";
            confirmText.style.color = "yellow";
            confirmText.innerHTML = "Story successfully posted!";
            setTimeout(() => {
                document.getElementById("story").innerHTML = "";
                window.location.href = "/";
            }, 2000);




        } else {
            //Inform for errors
            document.getElementById("story").innerHTML = "";
            confirmText.color = "yellow";
            confirmText.innerHTML = "Error! Please try again!";
            setTimeout(() => {
                confirmText.innerHTML = "";

            }, 2000);

        }





    };



}
//LogOut function
function logOut() {
    //Clear sessionStorage
    sessionStorage.clear();
    //Redirect to homepage
    window.location.href = "/";
}