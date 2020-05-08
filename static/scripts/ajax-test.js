/**
 *
 * @param {int} pageNo - the route number for the page of users
 */
function displayListOfUsers(pageNo) {

    let xmlhttp = new XMLHttpRequest();
    let users = [];

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) { // check status of http request

            users = JSON.parse(this.responseText); // create an Object of the parsed JSON
            changeTableContents("tblUsers", users, pageNo);

        }
    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users/" + pageNo.toString(), true);
    xmlhttp.send();

}


/**
 * Sets each row in an existing table to a list of users
 *
 * @param {string} tableID - The ID of the table to edit, Array of JSON objects
 * @param {Array} users - An array of JSON objects of users
 * @param {int} pageNo - the page number for the current page
 */
function changeTableContents(tableID, users, pageNo) {

    let table = document.getElementById(tableID);


    for (let i = 1; i < table.rows.length; i++) { // iterate through the rows of users

        // sort the JSON data to the same format as the table data
        let userData = [users[i-1].id, users[i-1].email, users[i-1].first_name, users[i-1].last_name
        ,'<img src="'+ users[i-1].avatar + '" alt="avatar">'];


        for (let x = 0; x < table.rows[i].cells.length; x++) { // iterate through the cells in the rows of users

            table.rows[i].cells[x].innerHTML = userData[x];

        }

    }

    let pageNumber = document.getElementById("pageNumber");
    pageNumber.innerHTML = pageNo.toString();

}


function displaySingleUser(ev){

    // targets the user that is clicked on to display that specific user
    let target = ev.target
    let userToFind = target.innerText;
    let users = [];

    if (userToFind !== "") { // if the avatar was not clicked, as it does not return text

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

                users = JSON.parse(this.responseText);
                createModalBox(userToFind, users);

            }

        }

        xmlhttp.open("GET", "http://127.0.0.1:5000/api/users", true);
        xmlhttp.send();

    }



}


//TODO: create modal box with user
function createModalBox(userToFind, users) {

    let user;

    for (let i = 0; i , users.length; i++) {

        if (Object.values(users[i]).includes(userToFind)) {

            user = users[i];
            break;

        }

    }

    console.log("Worked");
    console.log(user);

}


initPage = function() {
    /**
     * GET USERS, sets the table buttons to functions to get users from JSON
     *
     */
    // table buttons
    let pageOneButton = document.getElementById('btnPrevious');
    let pageTwoButton = document.getElementById('btnNext');

    pageOneButton.addEventListener("click", function(){displayListOfUsers(1)});
    pageTwoButton.addEventListener("click", function(){displayListOfUsers(2)});

    /**
     * GET USER, sets the table rows a function to get a single user
     *
     */
    for (let i = 1; i < document.getElementById("tblUsers").rows.length; i++) { // iterate through the users

        // get each user in the table by their <tr> ID
        let user = document.getElementById("user" + i.toString())

        // add a click function to the user that displays them
        user.addEventListener("click", function (ev) {displaySingleUser(ev)});

    }

}


initPage();
