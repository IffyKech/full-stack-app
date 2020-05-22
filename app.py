""" Full page app """
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_url_path='')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1

users = [
    {"id": 1, "email": "george.bluth@reqres.in", "first_name": "George", "last_name": "Bluth",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"},
    {"id": 2, "email": "janet.weaver@reqres.in", "first_name": "Janet", "last_name": "Weaver",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},
    {"id": 3, "email": "emma.wong@reqres.in", "first_name": "Emma", "last_name": "Wong",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"},
    {"id": 4, "email": "eve.holt@reqres.in", "first_name": "Eve", "last_name": "Holt",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"},
    {"id": 5, "email": "charles.morris@reqres.in", "first_name": "Charles", "last_name": "Morris",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"},
    {"id": 6, "email": "tracey.ramos@reqres.in", "first_name": "Tracey", "last_name": "Ramos",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"},
    {"id": 7, "email": "michael.lawson@reqres.in", "first_name": "Michael", "last_name": "Lawson",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"},
    {"id": 8, "email": "lindsay.ferguson@reqres.in", "first_name": "Lindsay", "last_name": "Ferguson",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"},
    {"id": 9, "email": "tobias.funke@reqres.in", "first_name": "Tobias", "last_name": "Funke",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"},
    {"id": 10, "email": "byron.fields@reqres.in", "first_name": "Byron", "last_name": "Fields",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"},
    {"id": 11, "email": "george.edwards@reqres.in", "first_name": "George", "last_name": "Edwards",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"},
    {"id": 12, "email": "rachel.howell@reqres.in", "first_name": "Rachel", "last_name": "Howell",
     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"},
    {"id": 13, "email": "aouterbridge0@cdc.gov", "first_name": "Addi", "last_name": "Outerbridge",
     "avatar": "https://robohash.org/voluptatemollitianecessitatibus.jpg"},
    {"id": 14, "email": "gzanuciolii1@hugedomains.com", "first_name": "Grissel", "last_name": "Zanuciolii",
     "avatar": "https://robohash.org/estutqui.jpg"},
    {"id": 15, "email": "gpenquet2@mozilla.com", "first_name": "Gwen", "last_name": "Penquet",
     "avatar": "https://robohash.org/optiodelectusvoluptates.jpg"},
    {"id": 16, "email": "bfeast3@usda.gov", "first_name": "Brunhilda", "last_name": "Feast",
     "avatar": "https://robohash.org/laborumomniscorrupti.jpg"},
    {"id": 17, "email": "jstarr4@spiegel.de", "first_name": "Jenny", "last_name": "Starr",
     "avatar": "https://robohash.org/etquaerateligendi.jpg"},
    {"id": 18, "email": "lclemoes5@cnet.com", "first_name": "Lynnette", "last_name": "Clemoes",
     "avatar": "https://robohash.org/oditautitaque.jpg"},
    {"id": 19, "email": "thurndall6@pcworld.com", "first_name": "Torre", "last_name": "Hurndall",
     "avatar": "https://robohash.org/voluptasminusconsequatur.jpg"},
]


@app.route('/')
def load_html_file():
    return render_template("users.html")


@app.route('/static/css/<file>')
def return_css(file):
    return app.send_static_file(file)


@app.route('/api/users')
def return_all_users():
    return jsonify(users)


# GET SINGLE USER
@app.route('/api/users/<user_to_find>', methods=["GET"])
def return_single_user(user_to_find):
    for user in users:
        for key, value in user.items():  # searches through keys/values of user dict
            if user_to_find != value:
                try:
                    if int(user_to_find) == value:  # convert user_attr to int to check if it is the ID
                        return jsonify(user)
                except ValueError:
                    pass
            else:  # if the user searched for is in the list of users
                return jsonify(user)


# GET LIST OF USERS
@app.route('/api/users/page<pageno>', methods=["GET"])
def return_users(pageno):
    pageno = str(pageno)
    start_slice = (5 * (int(pageno) - 1) + int(pageno) - 1)

    try:
        print(users[start_slice])  # eval statement for try block, checks if the page entered contains users
        end_slice = start_slice + 6
        return jsonify(users[start_slice: end_slice])

    except IndexError:  # runs if the eval statement above fails
        return "404 Page Not Found"


# DELETE USER
@app.route('/api/users/<user_to_find>', methods=["DELETE"])
def delete_user(user_to_find):
    user_to_find = int(user_to_find)
    for index in range(0, len(users) - 1):
        if users[index]["id"] == user_to_find:
            return jsonify(users)
    return "Missing user"


# TODO: bug fixing needed to delete newly created user

# CREATE USER
@app.route('/api/users', methods=["POST"])
def create_user():
    # get query string args to retrieve the inputs from the form
    first_name = request.args['fname']
    last_name = request.args['lname']
    email = request.args['email']
    user_id = users[-1]['id'] + 1  # set the user's ID to the ID after the last user in the list

    # add the new user to the end of the list of users
    users.append({"id": user_id, "email": email, "first_name": first_name, "last_name": last_name})

    return jsonify(users)


# ERROR CATCHING
@app.route('/undefined', methods=["GET"])
def catch_err():
    return "404 Page Not Found"


if __name__ == '__main__':
    app.run()
