//This function register a new user
function registerProcess() {
    //Link DOM values
    let registerName = document.getElementById("rgname").value;
    let registerUsername = document.getElementById("rguname").value;
    let registerPassword = document.getElementById("rgpword").value;
    let registerEmail = document.getElementById("rgemail").value;
    let countryCode = document.getElementById("country-code");
    let registerPhone = countryCode.options[countryCode.selectedIndex].value + document.getElementById("rgphone").value;

    //Check if a field is empty
    if (registerName == "" || registerUsername == "" || registerPassword == "" || document.getElementById("rgphone").value == "" || registerEmail == "") {

        //Display Error message
        document.getElementById('rgError').style.color = "red";
        document.getElementById('rgError').innerHTML = "Please fill in all fields!";
        setTimeout(() => {
            document.getElementById('rgError').innerHTML = "";
        }, 3500);

    } else {

        //Set up XMLHttpRequest
        let xhttp = new XMLHttpRequest();

        //Create object with user data
        let usrObj = {
            name: registerName,
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
            phone: registerPhone
        };

        //Send new user data to server
        xhttp.open("POST", "/register", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(usrObj));


        //Set up function that is called when reply received from server
        xhttp.onreadystatechange = function() {


            if (this.readyState == 4 && this.status == 200) {


                //Display successful message
                document.getElementById('rgError').style.color = "red";
                document.getElementById('rgError').innerHTML = "User has been added!";
                setTimeout(() => {
                    document.getElementById('rgError').innerHTML = "";
                    window.location.href = "/";
                }, 2000);

            } else {

                //DIsplay error message
                document.getElementById('rgError').style.color = "red";
                document.getElementById('rgError').innerHTML = "Username is already taken!";
                setTimeout(() => {
                    document.getElementById('rgError').innerHTML = "";

                    document.getElementById("rguname").value = "";


                }, 2000);


            }




        };


    }

}