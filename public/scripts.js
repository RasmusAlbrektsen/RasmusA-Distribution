class Course {

    constructor(name) {
        this.name = name
        this.deadlines = [];

    }

}


class Deadline {

    constructor(course, description) {
        this.day = markedDay.textContent;
        this.monthAndYearString = monthAndYear.textContent;
        this.course = course;
        this.description = description;
    }

}

var courseArray = [];

fetch("data.json")
    .then(response => response.json())
    .then(json => console.log(json));


var list1 = document.getElementById('classList');
var list2 = list1.getElementsByTagName("li");
var selectCourseList = document.getElementById('selectList');


for (let i = 0; i < list2.length; i++) {
    var option = document.createElement("option");
    option.text = list2[i].textContent;
    selectCourseList.add(option);
}

function addDeadline() {
    var input = document.getElementById('deadlineInput');
    var courseList = document.getElementById('selectList')
    if (input.value.length != 0) {
        var deadlineList = document.getElementById('deadlineList');
        var li = document.createElement("li");

        //creating a new deadline
        d = new Deadline(courseList.options[courseList.selectedIndex].value, input.value);

        //appending the new deadline to the deadline list
        li.appendChild(document.createTextNode(d.course + ": " + d.description + " - " + d.day + " " + d.monthAndYearString));
        deadlineList.appendChild(li);
        input.value = "";

    } else {
        alert("Deadline description field is empty!");
    }
}

function addClass() {
    var input = document.getElementById('classInput');
    if (input.value.length != 0) {
        var classList = document.getElementById('classList');
        var li = document.createElement("li");

        //creating a new course
        c = new Course(input.value)
        courseArray.push(c)

        //Appending the new course to the course list
        li.appendChild(document.createTextNode(c.name));
        classList.appendChild(li);

        //Adding new class to select list
        var option = document.createElement("option");
        option.text = c.name;
        input.value = "";
        selectCourseList.add(option);
    } else {
        alert("Class name field is empty!");
    }
}