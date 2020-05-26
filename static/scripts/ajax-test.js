let currentPage = 1;
let totalPages;

function getTotalPages() {
    /**
     * Get the total amount of pages based on the amount of users in the list. Then updates an element in the HTML
     * to reflect the number
     *
     * @type {XMLHttpRequest}
     */

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let amountOfUsers = JSON.parse(this.responseText).length; // get the amount of users based on length of list
            // round the amount of users to the nearest multiple of 6 (to prevent 'totalPages' from being a float)
            totalPages = (Math.ceil(amountOfUsers / 6) * 6) / 6;
            document.getElementById("totalPages").innerHTML = totalPages;

        }

    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users", true);
    xmlhttp.send();

}


/**
 * Display the page of users to be displayed based on the currentPage variable. The variable is managed based on the
 * buttons pressed
 *
 * @param ev- button clicked
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
    /**
     * Refresh the HTML table to show the new user list whenever a change is made to it
     *
     * @param pageNo - the page that needs to be updated to show new users
     * @type {XMLHttpRequest}
     */

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
    /**
     * Searches for the user to be displayed by looking at the current HTML element clicked on
     *
     * @type {string | Element | T | EventTarget | Node | SVGAnimatedString | HTMLElement}
     */

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


function displaySingleUser(user){
    /**
     * Displays a user by changing the HTML elements of the display window to the values of the user that is found
     *
     * @param users - the user that has been clicked on and should be displayed
     * @type {HTMLElement}
     */

    let userId = document.getElementById("userID");
    userId.value = user.id;

    let userEmail = document.getElementById("userEmail");
    userEmail.value = user.email;

    let userName = document.getElementById("userFirstName");
    userName.value = user.first_name;

    let userSurname = document.getElementById("userLastName");
    userSurname.value = user.last_name;

    let userAvatar = document.getElementById("userAvatar");
    userAvatar.src = user.avatar;

}


function deleteUser() {
    /**
     * Gets the user to delete by retrieving the ID of the current user that is clicked on. Then refreshes the table
     * to show the updated list of users
     */

    // ID of the user to delete
    let IDToDelete = document.getElementById("userID").value;

    // if no user was clicked on to delete
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
    /**
     * Creates a new user by retrieving the values written in the form's inputs. Then passes them as query string
     * arguments for the backend to retrieve. Lastly, refreshes the table of users to display the new list of users.
     */

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


function updateUser() {
    /**
     * Updates a current user by getting the form's inputs and passing them as query string args. The backend saves the
     * new details and returns the new list. The function then refreshes the HTML table with the new list of users
     *
     */
    let userToUpdate = document.getElementById("userID").value;

    // if no user to update was clicked on
    if (userToUpdate === ""){
        alert("Select a user to update");
    }

    else {
        let updatedEmail = document.getElementById("userEmail").value;
        let updatedFName = document.getElementById("userFirstName").value;
        let updatedLName = document.getElementById("userLastName").value;
        let xmlhttp = new XMLHttpRequest();


        xmlhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                refreshListOfUsers(currentPage);

            }

        }

        xmlhttp.open("PUT", "http://127.0.0.1:5000/api/users/" + userToUpdate.toString() +"?email=" +
            updatedEmail.toString() + "&fname=" + updatedFName.toString() + "&lname=" + updatedLName.toString(), true);
        xmlhttp.send();
    }


}


initPage = function() {
    /**
     * initialize function, loads when the script is run and configures HTML elements.
     */

    // Displays the amount of pages in a HTML element
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
    saveUserButton.addEventListener("click", function () {updateUser()});


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
