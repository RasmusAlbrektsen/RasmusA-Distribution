class Course {

    constructor(name) {
        this.name = name;
        this.deadlines = [];

    }

}

class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class Deadline {

    constructor(courseName, description) {
        this.day = markedDay.textContent;
        this.month = currentMonth + 1;
        this.year = currentYear;
        this.courseName = courseName;
        this.description = description;
    }

}

const serverURL = "http://localhost:8080";
let currentUser = "";
let loggedIn = false;
let resourcesLoaded = false;

async function getData(url) {
    var token = localStorage.getItem('token');
    console.log("token in getData = " + token)
    const response = fetch(url, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    return response;
}

async function postData(url, data) {
    var token = localStorage.getItem('token');
    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    return response;
}

window.onload = async function main() {
    localStorage.clear();
};

async function loginAction() {
    if(document.getElementById('loggedInLabel').innerHTML == "") {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var user = new User(username, password);
        console.log("Client side= " + username)
        console.log("Client side= " + password)
        try {
            await login(user);
        } catch (err) {
            console.log(err);
        }
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    } else {
        alert("A user is already logged in!")
    }
}

async function login(data) {
    const response = fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true,
        body: JSON.stringify(data)
    }).then(response => response.json()).then(response => {
        localStorage.setItem('token', response.token);
        if(response.token != null) {
            loggedIn = true;
        }
        document.getElementById("loggedInLabel").innerHTML = data.username;
        currentUser = data.username;
    });
}

async function loadCourses() {
    if(loggedIn && resourcesLoaded == false) {
        emptyEverything();
        try {
            const data = await getData(serverURL + "/users/" + currentUser + "/courses");

            //Populates Class & Deadline Lists
            for (let i = 0; i < data.length; i++) {
                populateCourses(data[i]['name']);
                populateDeadlines(data[i]);
            }

            populateDeadlinesDropDown();
            resourcesLoaded = true;
        } catch (err) {
            alert(err);
        }
    }
}

var courseArray = [];
var courseList = document.getElementById('courseList');
var courseListElements = courseList.getElementsByTagName("li");
var selectCourseList = document.getElementById('selectList');
var deadlineList = document.getElementById('deadlineList');

function populateCourses(courseName) {
    var newCourse = document.createElement("li");
    newCourse.text = courseName;
    newCourse.appendChild(document.createTextNode(courseName));
    courseList.appendChild(newCourse);
}

function populateDeadlines(course) {
    var deadlineArray = course.deadlines;
    for (let i = 0; i < deadlineArray.length; i++) {
        var newDeadline = document.createElement("li");
        newDeadline.text = course.name;
        newDeadline.appendChild(document.createTextNode(deadlineArray[i].courseName + ": "
            + deadlineArray[i].description + " - "
            + deadlineArray[i].day + "/"
            + deadlineArray[i].month + "/"
            + deadlineArray[i].year));
        deadlineList.appendChild(newDeadline);
    }
}

function populateDeadlinesDropDown() {
    for (let i = 0; i < courseListElements.length; i++) {
        var option = document.createElement("option");
        option.text = courseListElements[i].textContent;
        selectCourseList.add(option);
    }
}

async function addDeadline() {
    var input = document.getElementById('deadlineInput');
    var courseList = document.getElementById('selectList');
    if (input.value.length === 0) {
        alert("Deadline description field is empty!");
    } else if (markedDay === undefined) {
        alert("You haven't selected a date!");
    } else {
        var li = document.createElement("li");
        var data;

        //creating a new deadline
        d = new Deadline(courseList.options[courseList.selectedIndex].value, input.value);
        for (let i = 0; i < courseArray.length; i++) {
            if (d.courseName === courseArray[i]) {
                courseArray[i].deadlines.push(d);
            }
        }

        //Sending new deadline to server
        try {
            data = await postData(serverURL + "/users/" + currentUser + "/courses/"
            + courseList.selectedIndex + "/deadlines", d);
        } catch (err) {
            console.log(err);
        }

        //appending the new deadline to the deadline list
        li.appendChild(document.createTextNode(data.courseName + ": " + data.description + " - " + data.day + "/" + data.month + "/" + data.year));
        deadlineList.appendChild(li);
        input.value = "";
        unMark();
    }
}

async function addCourse() {
    var input = document.getElementById('courseInput');
    if (input.value.length !== 0) {
        var courseList = document.getElementById('courseList');
        var li = document.createElement("li");
        var data;

        //creating a new course
        var c = new Course(input.value);

        //Sending new course to server
        try {
            data = await postData(serverURL + "/users/" + currentUser + "/courses", c);
        } catch (err) {
            console.log(err);
        }


        courseArray.push(data);

        //Appending the new course to the course list
        li.appendChild(document.createTextNode(data.name));
        courseList.appendChild(li);

        //Adding new class to select list
        var option = document.createElement("option");
        option.text = data.name;
        selectCourseList.add(option);
        
        input.value = "";
    } else {
        alert("Class name field is empty!");
    }
}
function emptyEverything() {
    while(courseList.firstChild) {
        courseList.removeChild(courseList.firstChild);
    }
    while(deadlineList.firstChild) {
        deadlineList.removeChild(deadlineList.firstChild);
    }
    while(selectCourseList.firstChild) {
        selectCourseList.removeChild(selectCourseList.firstChild);
    }
}

function logOut() {
    if(loggedIn == true) {
        localStorage.clear();
        document.getElementById('loggedInLabel').innerHTML = "";
        resourcesLoaded = false;
        emptyEverything();
        alert("Logged out");
    }
}