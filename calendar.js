let today = new date()
let currentMonth = today.getMonth()
let currentYear = today.getFullYear()
let selectedYear = document.getElementById("year")
let selectedMonth = document.getElementById("month")

let months = ["January", "February", "Marts", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

let monthAndYear = document.getElementById("newName")
createCalendar(currentMonth, currentYear)


function next() {
    if (currentMonth === 11) {
        currentYear = currentYear + 1
    }
    currentMonth = (currentMonth + 1) % 12
    createCalendar(currentMonth, currentYear)
}

function previous() {

    if (currentMonth === 0) {
        currentYear = currentYear - 1
        currentMonth = 11
    }
    else if (currentMonth != 0) {
        currentMonth = currentMonth - 1
    }
    createCalendar(currentMonth, currentYear)
}

function jump() {
    //Jumps to selected year and month
    currentYear = parseInt(selectedYear.value)
    currentMonth = parseInt(selectedMonth.value)
    createCalendar(currentMonth, currentYear)
}

function createCalendar(month, year) {
    
    
    let date = new Date()
    let firstDay = (new Date(year, month)).getDay()
    let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)


}