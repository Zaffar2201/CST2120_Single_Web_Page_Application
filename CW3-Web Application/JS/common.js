// Get the modal
var lgmodal = document.getElementById("loginModal");
var rgmodal = document.getElementById("registerModal");

// Get the link that opens the modal
var loginLink = document.getElementById("login");
var registerLink = document.getElementById("register");
var myStoryLink = document.getElementById("myStory");
var homeLink = document.getElementById("index");
var normalStory = document.getElementById("main");
var userStory = document.getElementById("mainUserStory");

// Get the <span> element that closes the modal
var closelg = document.getElementsByClassName("close")[0];
var closerg = document.getElementsByClassName("close")[1];

// When the user clicks the login link, open the modal 
loginLink.onclick = function() {
        lgmodal.style.display = "block";

        //Check if a user is already logged in to prevent re-logging
        if (sessionStorage.length != 0) {
            //Inform user
            document.getElementById('loginError').style.color = "red";
            document.getElementById('loginError').innerHTML = "Already logged in!";
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);


        }



    }
    // When the user clicks the register link, open the modal 
registerLink.onclick = function() {
        //Set display to block
        rgmodal.style.display = "block";

        //Checks if user is already logged in to prevent registration while logged in
        if (sessionStorage.length != 0) {
            //Inform user
            document.getElementById('rgError').style.color = "red";
            document.getElementById('rgError').innerHTML = "Cannot register while logged in!";
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);


        }




    }
    //Upon clicking Story link
myStoryLink.onclick = function() {
        //Call checkUserSession(story.js) function
        checkUserSession();
        normalStory.style.display = "none";
        userStory.style.display = "block";


    }
    //Upon clicking home link
homeLink.onclick = function() {
    //Display all stories
    normalStory.style.display = "block";
    //Hide specific user stories
    userStory.style.display = "none";

}


// When the user clicks on <span> (x), close the modal
closelg.onclick = function() {
    lgmodal.style.display = "none";

}
closerg.onclick = function() {
    rgmodal.style.display = "none";
}

window.onload = display();


function display() {
    //By default display all story div and hide userStory div
    normalStory.style.display = "block";
    userStory.style.display = "none";

}