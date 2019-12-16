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
const currentUser = "";

async function getData(url) {
    var token = localStorage.getItem('token');
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        }
    });
    return response.json()
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}

window.onload = async function main() {
  /*  try {
        const data = await getData(serverURL + "/courses");

        //Populates Class & Deadline Lists
        for (let i = 0; i < data.courses.length; i++) {
            populateCourses(data.courses[i]['name']);
            populateDeadlines(data.courses[i]);
        }

        populateDeadlinesDropDown();
    } catch (err) {
        alert("Server error\n" + err);
    }*/
};

function loginAction() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var user = new User(username, password);
    console.log("Client side= " + username)
    console.log("Client side= " + password)
    try {
        const data = login(user);
        localStorage.setItem('token', data.token);
        document.getElementById("loggedInLabel").innerHTML = user.username;
        loadCourses();
    } catch (err) {
        console.log(err);
    }
}

function login(data) {
    console.log(data)
    console.log(JSON.stringify(data))
    const response = fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

async function loadCourses() {
    var username = document.getElementById("loggedInLabel").textContent;
    try {
        const data = await getData(serverURL + "/users/" + username + "/courses");

        //Populates Class & Deadline Lists
        for (let i = 0; i < data.courses.length; i++) {
            populateCourses(data.courses[i]['name']);
            populateDeadlines(data.courses[i]);
        }

        populateDeadlinesDropDown();
    } catch (err) {
        alert("Server error\n" + err);
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

        //Sending new course to server
        try {
            data = await postData(serverURL + "/courses/" + courseList.selectedIndex, d);
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
            data = await postData(serverURL + "/courses/", c);
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