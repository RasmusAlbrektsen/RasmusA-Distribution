var list1 = document.getElementById('classList');
var list2 = list1.getElementsByTagName("li");
var select = document.getElementById('selectList');


var i;
for (i = 0; i < list2.length; i++) {
  var option = document.createElement("option");
  option.text = list2[i].textContent;
  select.add(option);
}

function addAppointment(){
  var input = document.getElementById('appointmentInput');
  if(input.value.length != 0) {
    
  } else {
    alert("Appointment description field is empty!");
  }
  
}

function addDeadline(){
  var input = document.getElementById('deadlineInput');
  if(input.value.length != 0) {
    var list = document.getElementById('deadlineList');
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(input.value));
    list.appendChild(li);
    input.value = "";
  } else {
    alert("Deadline description field is empty!");
  }
}

function addClass(){
  var input = document.getElementById('classInput');
  if(input.value.length != 0){
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