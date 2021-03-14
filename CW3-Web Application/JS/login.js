//This function is executed when user press login button
function loginProcess() {
    //Retrieves login form input text value
    let loginUsername = document.getElementById("lguname").value;
    let loginPassword = document.getElementById("lgpword").value;

    //Checks if input fields are empty
    if (loginUsername == "" || loginPassword == "") {

        //Display Error message
        document.getElementById('loginError').style.color = "red";
        document.getElementById('loginError').innerHTML = "Please fill in all fields!";
        setTimeout(() => {
            document.getElementById('loginError').innerHTML = "";
        }, 3500);

    } else {

        //Set up XMLHttpRequest
        let xhttp = new XMLHttpRequest();

        //Create object with user data
        let usrObj = {
            username: loginUsername,
            password: loginPassword

        };

        //Send new user data to server
        xhttp.open("POST", "/authenticate", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(usrObj));

        //Set up function that is called when reply received from server
        xhttp.onreadystatechange = function() {


            if (this.readyState == 4 && this.status == 200) {

                //Display welcome message for successful login
                document.getElementById('loginError').style.color = "red";
                document.getElementById('loginError').innerHTML = "Welcome " + loginUsername;
                sessionStorage.loggedInUsername = loginUsername;
                setTimeout(() => {
                    //Redirect to homepage after 1 second
                    window.location.href = "/";

                }, 1000);


            } else {
                //Display error message for invalid credentials
                document.getElementById('loginError').style.color = "red";
                document.getElementById('loginError').innerHTML = "Invalid Username/Password";
                setTimeout(() => {
                    //Reset all fields after 2 seconds
                    document.getElementById('loginError').innerHTML = "";
                    document.getElementById("lguname").value = "";
                    document.getElementById("lgpword").value = "";


                }, 2000);

            }





        };


    }


}