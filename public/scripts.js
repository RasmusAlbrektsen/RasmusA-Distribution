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



fetch("http://localhost:8080/courses")
    .then(response => response.json())
    .then(json => console.log(json));


var list1 = document.getElementById('classList');
var list2 = list1.getElementsByTagName("li");
var select = document.getElementById('selectList');


for (let i = 0; i < list2.length; i++) {
    var option = document.createElement("option");
    option.text = list2[i].textContent;
    select.add(option);
}

function addDeadline() {
    var input = document.getElementById('deadlineInput');
    var courseList = document.getElementById('selectList')
    if (input.value.length != 0) {
        //var deadlineList = document.getElementById('deadlineList');
        d = new Deadline(courseList.options[courseList.selectedIndex].value, input.value);
        console.log(d)


    } else {
        alert("Deadline description field is empty!");
    }


    var input = document.getElementById('deadlineInput');
    if (input.value.length != 0) {
        var list = document.getElementById('deadlineList');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(input.value));
        list.appendChild(li);
        input.value = "";
    } else {
        alert("Deadline description field is empty!");
    }
}

function addClass() {
    var input = document.getElementById('classInput');
    if (input.value.length != 0) {
        var list = document.getElementById('classList');
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(input.value));
        list.appendChild(li);

        //Adding new class to select list
        var option = document.createElement("option");
        option.text = input.value;
        input.value = "";
        select.add(option);
    } else {
        alert("Class name field is empty!");
    }
}