""" Full page app """
from flask import Flask, render_template, jsonify, request
import json

# TODO: last feature: Update user

app = Flask(__name__, static_url_path='')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1


def read_user_file():
    """ Reads the user text file to retrieve all the users of the webpage. Then stores them in an array and returns
    the array to be used elsewhere """

    users = []

    with open("users.txt", 'r') as f:
        line = f.readline()
        line = line.strip("\n")  # get rid of newlines

        while line != "":
            line = json.loads(line)  # convert string to dictionary
            users.append(line)
            line = f.readline().strip("\n")
    return users


def rewrite_user_file(users):
    """
    Rewrites the user file when a new change is made to the users list (e.g. user is deleted)

    :param users: array of object of users
    :return:
    """
    with open("users.txt", 'w') as f:
        # json.dumps converts dictionary to string (so it can be written to file)
        f.write(json.dumps(users[0]) + "\n")

    with open("users.txt", 'a') as f:
        for index in range(1, len(users)):
            f.write(json.dumps(users[index]) + "\n")


@app.route('/')
def load_html_file():
    return render_template("users.html")


@app.route('/static/css/<file>')
def return_css(file):
    return app.send_static_file(file)


# GET LIST OF USERS
@app.route('/api/users')
def return_all_users():
    users = read_user_file()
    return jsonify(users)


# GET SINGLE USER
@app.route('/api/users/<user_to_find>', methods=["GET"])
def return_single_user(user_to_find):
    users = read_user_file()

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


# GET LIST OF USERS (PAGING)
@app.route('/api/users/page<pageno>', methods=["GET"])
def return_users(pageno):
    users = read_user_file()

    pageno = str(pageno)
    start_slice = (5 * (int(pageno) - 1) + int(pageno) - 1)

    try:
        end_slice = start_slice + 6
        users = users[start_slice: end_slice]
        return jsonify(users)

    except IndexError:  # runs if the try statement above fails
        return "404 Page Not Found"


# DELETE USER
@app.route('/api/users/<user_to_find>', methods=["DELETE"])
def delete_user(user_to_find):
    users = read_user_file()
    user_to_find = int(user_to_find)

    for index in range(0, len(users)):
        if users[index]["id"] == user_to_find:
            del users[index]

            # rewrite new list of users to file
            rewrite_user_file(users)

            return jsonify(users)
    return "Missing user"


# CREATE USER
@app.route('/api/users', methods=["POST"])
def create_user():
    users = read_user_file()

    # get query string args to retrieve the inputs from the form
    first_name = request.args['fname']
    last_name = request.args['lname']
    email = request.args['email']
    user_id = users[-1]['id'] + 1  # set the user's ID to the ID after the last user in the list

    # add the new user to the end of the list of users
    users.append({"id": user_id, "email": email, "first_name": first_name, "last_name": last_name})

    # rewrite new list of users to file
    rewrite_user_file(users)

    return jsonify(users)


# ERROR CATCHING
@app.route('/undefined', methods=["GET"])
def catch_err():
    return "404 Page Not Found"


if __name__ == '__main__':
    app.run()
