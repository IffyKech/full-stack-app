getUsers = function(pageNo) {
    console.log("Hello");
    let xmlhttp = new XMLHttpRequest();
    let users = [];

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) { // check status of http request

            users = JSON.parse(this.responseText); // create an Object of the parsed JSON
            console.table(users);
            changeTableContents("tblUsers", users);

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
 */
changeTableContents = function (tableID, users) {

    var table = document.getElementById(tableID);


    for (let i = 1; i < table.rows.length; i++) { // iterate through the rows of users

        // sort the JSON data to the same format as the table data
        let userData = [users.data[i-1].id, users.data[i-1].email, users.data[i-1].first_name, users.data[i-1].last_name
        ,'<img src="'+ users.data[i-1].avatar + '" alt="avatar">'];

        for (let x = 0; x < table.rows[i].cells.length; x++) { // iterate through the cells in the rows of users

            table.rows[i].cells[x].innerHTML = userData[x];

        }

    }

}

// getUsers();


initPage = function() {

    console.log("hello");
    // table buttons
    let pageOneButton = document.getElementById("btnPrevious");
    let pageTwoButton = document.getElementById("btnNext");

    pageOneButton.onclick = getUsers(1);
    pageTwoButton.onclick = getUsers(2);

}


initPage();