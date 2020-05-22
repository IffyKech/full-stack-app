let currentPage = 1;
let totalPages;

// TODO: for post, get details to create (e.g. fname, lname etc.) and make an object (dictionary) of those values,
// then send the object to a resource for the backend to receive and unpack and add to the database

function getTotalPages() {

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let amountOfUsers = JSON.parse(this.responseText).length;
            // round the amount of users to the nearest multiple of 6 (to prevent 'totalPages' from being a float)
            totalPages = (Math.ceil(amountOfUsers / 6) * 6) / 6;
            document.getElementById("totalPages").innerHTML = totalPages;

        }

    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users", true);
    xmlhttp.send();

}
/**
 *
 * @param ev - button clicked
 * @param {int} pageNo - the route number for the page of users
 */
function displayListOfUsers(ev, pageNo) {
    // get the button pressed
    let target = ev.target;

    // if the 'previous' button was pressed, and there is another page to go back to:
    if (target.id === "btnPrevious" && currentPage !== 1) {

        pageNo = currentPage - 1
        currentPage = pageNo;

    }

    // if the 'next' button was pressed, and there is another page to go forwards to:
    else if (target.id === "btnNext" && currentPage + 1 < totalPages + 1) {

        pageNo = currentPage + 1
        currentPage = pageNo;

    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) { // check status of http request

            let users = JSON.parse(this.responseText); // create an Object of the parsed JSON
            changeTableContents("tblUsers", users, pageNo);

        }
    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users/page" + pageNo.toString(), true);
    xmlhttp.send();

}


function refreshListOfUsers(pageNo) {

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let users = JSON.parse(this.responseText);
            getTotalPages();
            changeTableContents("tblUsers", users, pageNo);

        }

    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users", true);
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

        let userData = ["", "", "", "", ""];

        try {
            // sort the JSON data to the same format as the table data
            userData = [users[i-1].id, users[i-1].email, users[i-1].first_name, users[i-1].last_name
                ,'<img src="'+ users[i-1].avatar + '" alt="avatar">'];

        }

        catch (e) {

        }

        for (let x = 0; x < table.rows[i].cells.length; x++) { // iterate through the cells in the rows of users

            table.rows[i].cells[x].innerHTML = userData[x];

        }

    }

    let pageNumber = document.getElementById("pageNumber");
    pageNumber.innerHTML = pageNo.toString();

}


function findUserToDisplay (ev) {

    // targets the user that is clicked on to display that specific user
    let target = ev.target;
    let userToFind = target.innerText;

    if (userToFind !== "") {  // if the avatar was not clicked, as it does not return text

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                let user = JSON.parse(this.responseText);
                displaySingleUser(user);

            }

        }

        xmlhttp.open("GET", "http://127.0.0.1:5000/api/users/" + userToFind.toString(), true)
        xmlhttp.send();

    }

}


function displaySingleUser(users){

    let userId = document.getElementById("userID");
    userId.value = users.id;

    let userEmail = document.getElementById("userEmail");
    userEmail.value = users.email;

    let userName = document.getElementById("userFirstName");
    userName.value = users.first_name;

    let userSurname = document.getElementById("userLastName");
    userSurname.value = users.last_name;

    let userAvatar = document.getElementById("userAvatar");
    userAvatar.src = users.avatar;

}


function deleteUser() {

    // ID of the user to delete
    let IDToDelete = document.getElementById("userID").value;

    if (IDToDelete === "") {
        alert("Select a user to delete");
    }

    else {

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200 ) {

                refreshListOfUsers(currentPage);

            }

        }

        xmlhttp.open("DELETE", "http://127.0.0.1:5000/api/users/" + IDToDelete.toString(), true);
        xmlhttp.send();

    }


}

function createUser() {

    let userEmail = document.getElementById("newUserEmail").value;
    let userFirstName = document.getElementById("newUserFirstName").value;
    let userLastName = document.getElementById("newUserLastName").value;

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            refreshListOfUsers(currentPage);

        }

    }

    xmlhttp.open("POST", "http://127.0.0.1:5000/api/users?email=" + userEmail.toString() + "&fname=" +
        userFirstName.toString() + "&lname=" + userLastName.toString());

    xmlhttp.send();

}


initPage = function() {

    getTotalPages();
    
    /**
     * GET USERS, sets the table buttons to functions to get users from JSON
     *
     */
    // table buttons
    let pageOneButton = document.getElementById('btnPrevious');
    let pageTwoButton = document.getElementById('btnNext');

    pageOneButton.addEventListener("click", function(ev){displayListOfUsers(ev, currentPage)});
    pageTwoButton.addEventListener("click", function(ev){displayListOfUsers(ev, currentPage)});

    /**
     * GET USER, sets the table rows a function to get a single user
     *
     */
    for (let i = 1; i < document.getElementById("tblUsers").rows.length; i++) { // iterate through the users

        // get each user in the table by their <tr> ID
        let user = document.getElementById("user" + i.toString())

        // add a click function to the user that displays them
        user.addEventListener("click", function (ev) {findUserToDisplay(ev)});

    }

    // edit user buttons

    /**
     * SAVE USER, sets the save button to a function that saves the selected user
     *
     */
    let saveUserButton = document.getElementById("btnSaveUser");


    /**
     * DELETE USER, sets the delete button to a function that deletes the selected user
     *
     */
    let deleteUserButton = document.getElementById("btnDeleteUser");
    deleteUserButton.addEventListener("click", function () {deleteUser()});


    /**
     *  CREATE USER, sets the new user button to a function that creates a new user based on the form input
     *
     */
    let createUserButton = document.getElementById("btnNewUser");
    createUserButton.addEventListener("click", function () {createUser()});

}


initPage();
