class Course {

    constructor(name) {
        this.name = name
        this.deadlines = [];

    }

}


class Deadline {

    constructor(courseName, description) {
        this.day = markedDay.textContent;
        this.monthAndYearString = monthAndYear.textContent;
        this.courseName = courseName;
        this.description = description;
    }

}

const serverURL = "http://localhost:8080";

async function getData(url){
    const response = await fetch(url);
    //console.log(response.json);
    return response.json()
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    console.log('Succes:', JSON.stringify(json));
    return json;
}

window.onload = async function main() {
    const data = await getData(serverURL + "/courses");
    
    //Populates Class & Deadline Lists
    for (var i = 0; i < data.courses.length; i ++){
        populateClasses(data.courses[i]['name']);
        populateDeadlines(data.courses[i]);
    }
    populateDeadlinesDropDown();
}


var courseArray = [];



var classList = document.getElementById('classList');
var classListElements = classList.getElementsByTagName("li");
var selectCourseList = document.getElementById('selectList');
var deadlineList = document.getElementById('deadlineList');

function populateClasses(className) {
    var newClass = document.createElement("li");
    newClass.text = className;
    newClass.appendChild(document.createTextNode(className));
    classList.appendChild(newClass);
    console.log("created course: " + className);
}

function populateDeadlines(course) {
    var deadlineArray = course.deadlines;
    for (var i = 0; i < deadlineArray.length; i++){
        var newDeadline = document.createElement("li");
        newDeadline.text = course.name;
        newDeadline.appendChild(document.createTextNode(deadlineArray[i].courseName + ": " + deadlineArray[i].description + " - " + deadlineArray[i].day + " " + deadlineArray[i].monthAndYearString));
        deadlineList.appendChild(newDeadline);
        console.log("created deadline: " + deadlineArray[i].description);
    }
}

function populateDeadlinesDropDown(){
    for (let i = 0; i < classListElements.length; i++) {
        var option = document.createElement("option");
        option.text = classListElements[i].textContent;
        selectCourseList.add(option);
    }
}

async function addDeadline() {
    console.log(markedDay)
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
        console.log(courseList.length);
        for (let i = 0; i<courseArray.length; i++){
            console.log(d.courseName);
            console.log(courseArray[i]);
            if (d.courseName === courseArray[i]){
                courseArray[i].deadlines.push(d);
                console.log(courseArray[i].deadlines);
            }
        }
        
        //Sending new course to server
        try {
            data = await postData(serverURL + "/add/deadline/" + courseList.selectedIndex, d);
        }
        catch (err) {
            console.log(err);
        }

        //appending the new deadline to the deadline list
        li.appendChild(document.createTextNode(data.courseName + ": " + data.description + " - " + data.day + " " + data.monthAndYearString));
        deadlineList.appendChild(li);
        input.value = "";
    }
}

async function addClass() {
    var input = document.getElementById('classInput');
    if (input.value.length !== 0) {
        var classList = document.getElementById('classList');
        var li = document.createElement("li");
        var data;

        //creating a new course
        c = new Course(input.value);
        
        //Sending new course to server
        try {
            data = await postData(serverURL + "/add/course", c);
        }
        catch (err) {
            console.log(err);
        }
        
        console.log(data);
        
        courseArray.push(data);
        console.log(courseArray.length);
        
        //Appending the new course to the course list
        li.appendChild(document.createTextNode(data.name));
        classList.appendChild(li);
        
        //Adding new class to select list
        var option = document.createElement("option");
        option.text = data.name;
        input.value = "";
        selectCourseList.add(option);
    } else {
        alert("Class name field is empty!");
    }
}