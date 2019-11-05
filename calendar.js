function next(){
    if (currentMonth === 11){
        currentYear = currentYear + 1
    }
    currentMonth = (currentMonth + 1) % 12
    showCalendar(currentMonth, currentYear)
}

function previous(){

    if (currentMonth === 0){
        currentYear = currentYear - 1
        currentMonth = 11
    }
    else if (currentMonth != 0){
        currentMonth = currentMonth - 1
    }
    showCalendar(currentMonth, currentYear)
}

function jump() {
    //Jumps to selected year and month
    currentYear = parseInt(selectYear.value)
    currentMonth = parseInt(selectMonth.value)
    showCalendar(currentMonth, currentYear)
}