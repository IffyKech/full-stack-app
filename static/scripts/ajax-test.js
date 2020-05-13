let currentPage = 1;
let totalPages;

function getTotalPages() {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let amountOfUsers = JSON.parse(this.responseText).length;
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
    let users = [];

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) { // check status of http request

            users = JSON.parse(this.responseText); // create an Object of the parsed JSON
            changeTableContents("tblUsers", users, pageNo);

        }
    }

    xmlhttp.open("GET", "http://127.0.0.1:5000/api/users/page" + pageNo.toString(), true);
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
        let userData = ["", "", "", "", ""];

        try {
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


function displaySingleUser(ev){

    // targets the user that is clicked on to display that specific user
    let target = ev.target;

    let userToFind = target.innerText;

    // Converts a string of an int to an int (for a future comparison statement)
    if (!isNaN(userToFind) && userToFind.length > 0) {  // if the string contains a number (in this case, the ID)

        userToFind = parseInt(userToFind);  // convert it to a number

    }

    if (userToFind !== "") {  // if the avatar was not clicked, as it does not return text

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

                createModalBox(userToFind, (JSON.parse(this.responseText)));

            }

        }

        xmlhttp.open("GET", "http://127.0.0.1:5000/api/users/" + userToFind.toString(), true);
        xmlhttp.send();

    }

}


function createModalBox(userToFind, user) {

    // Edit Modal attributes to the selected user
    document.getElementById("modalHeaderText").innerHTML = user.first_name + " " + user.last_name;
    document.getElementById("modalImg").src = user.data.avatar;
    document.getElementById("modalFooterID").innerHTML = "User ID: " + user.id;
    document.getElementById("modalFooterEmail").innerHTML = "Email: " + user.email;
    document.getElementById("modalFooterFName").innerHTML = "Firstname: " + user.first_name;
    document.getElementById("modalFooterLName").innerHTML = "Lastname: " + user.last_name;

    // Get modal
    let modal = document.getElementById("modal");

    // Display the modal
    modal.style.display='block';


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
        user.addEventListener("click", function (ev) {displaySingleUser(ev)});

    }

}


initPage();
