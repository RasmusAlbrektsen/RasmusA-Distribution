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
    //console.log('Succes:', JSON.stringify(json));
    //console.log(json);
    return "fisk";
}

window.onload = async function main() {
    const data = await getData(serverURL + "/courses");
    
    //Populates Class List
    for (var i = 0; i < data.courses.length; i ++){
        populateClass(data.courses[i]['name']);
    }
}


var courseArray = [];



var list1 = document.getElementById('classList');
var list2 = list1.getElementsByTagName("li");
var selectCourseList = document.getElementById('selectList');

function populateClass(className) {
    var newClass = document.createElement("li");
    newClass.text = className;
    newClass.appendChild(document.createTextNode(className));
    classList.appendChild(newClass);
    console.log("created course: " + className);
}

for (let i = 0; i < list2.length; i++) {
    var option = document.createElement("option");
    option.text = list2[i].textContent;
    selectCourseList.add(option);
}

function addDeadline() {
    console.log(markedDay)
    var input = document.getElementById('deadlineInput');
    var courseList = document.getElementById('selectList');
    if (input.value.length === 0) {
        alert("Deadline description field is empty!");
    } else if (markedDay === undefined) {
        alert("You haven't selected a date!");
    } else {
        var deadlineList = document.getElementById('deadlineList');
        var li = document.createElement("li");

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

        //appending the new deadline to the deadline list
        li.appendChild(document.createTextNode(d.courseName + ": " + d.description + " - " + d.day + " " + d.monthAndYearString));
        deadlineList.appendChild(li);
        input.value = "";
    }
}

function addClass() {
    var input = document.getElementById('classInput');
    if (input.value.length !== 0) {
        var classList = document.getElementById('classList');
        var li = document.createElement("li");
        var data;

        //creating a new course
        c = new Course(input.value);

        //Appending the new course to the course list
        li.appendChild(document.createTextNode(c.name));
        classList.appendChild(li);
        
        //Sending new course to server
        try {
            data = postData(serverURL + "/add/course", c);
            console.log(data);
        }
        catch (err) {
            console.log(err);
        }
        
        courseArray.push(data);
        console.log(courseArray.length);
        
        //Adding new class to select list
        var option = document.createElement("option");
        option.text = data.name;
        input.value = "";
        selectCourseList.add(option);
    } else {
        alert("Class name field is empty!");
    }
}