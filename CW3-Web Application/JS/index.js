//Load all user stories
window.onload = getStories();

function getStories() {

    //Create request object 
    let request = new XMLHttpRequest();

    //Set up request with HTTP method and URL 
    request.open("GET", "/stories", true);

    //Send request
    request.send();


    //Create event handler that specifies what should happen when server responds
    request.onload = () => {
        //Check HTTP status code
        if (request.status == 200 && request.readyState == 4) {
            //Store data from server into global variable
            storiesJson = request.responseText;
            //Call display function with data received from server

            displayStories(storiesJson);

        } else
        //Alert user for errors
            alert("Error communicating with server: " + request.status);
    };


}


//This display all stories in the database
function displayStories(jsonStory) {

    //Convert JSON response into array
    let storyArray = JSON.parse(jsonStory);

    //Display form
    htmlStr = "";

    //Loop till end of array
    for (let i = 0; i < storyArray.length; i++) {

        htmlStr += '<div id="post">';
        htmlStr += '<div id="post-info">';
        htmlStr += '<div id="post-info-top">';
        htmlStr += '<img src="Images/reaper.png" alt="account_icon"></div>';
        htmlStr += ' <span style="padding-left:5px">' + storyArray[i].StoryUsername + '</span><br>';
        htmlStr += '<span style="padding-left:5px;">Date:- ' + storyArray[i].StoryDate.substr(0, 10) + '</span><br>';
        htmlStr += '<span style="padding-left:5px;">Time:- ' + storyArray[i].StoryTime.substr(0, 5) + '</span><br></div>';
        htmlStr += '<div id="post-story">' + storyArray[i].StoryDescription + '</div>';
        htmlStr += ' <br style="clear: both">';
        htmlStr += '</div>';



    }
    htmlStr += '<div id="subscriptionWrapper"><br><center><span style="font-family: Eater;color:red;">JOIN OUR MAILING LIST</span></center><br><!--Mailing form--><form id="mail-form" onsubmit="return false"><!--Mail input text box--><input type="email" id="subscription-email" name="subscription-email" placeholder="Email" autocomplete="off" size="98"><br><br><button type="submit" id="subscription-submit"><span style="color:white;font-size: 18.5px;font-family:verdana;">SUBSCRIBE NOW</span></button><br><br><br><br></form></div>';
    //Add all into a div string and display
    document.getElementById("main").innerHTML = htmlStr;

}