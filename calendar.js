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

    let firstDay = (new Date(year, month)).getDay()
    
    let daysInMonth = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate()

    // The last day of the previous month when comparing to the current month.
    let prevLastDay = (new Date(date.getFullYear(), date.getMonth(), 0)).getDate()

    let calendar = document.getElementById("calendar")
    calendar.innerHTML = "";

    let dateCounter = 1

    for(let i=0; i <= 5; i++) {
        let verticalRow = document.createElement("verticalRow")

        // Days from previous month, after subtracting the first day of current month
        let prevMonthDays = prevLastDay - firstDay
        for(let j=0; j <= 6; j++) {
            if (i==0 && (prevMonthDays !== prevLastDay) ){
                let dayCell = document.createElement("day")
                let dayCellText = document.createTextNode(prevMonthDays)
                dayCell.append(dayCellText)
                verticalRow.append(dayCell)
                prevMonthDays++
            } 
            else if (date > daysInMonth) {
                break;
            }
            else {
                let dayCell = document.createElement("day")
                let dayCellText = document.createTextNode(dateCounter)
                dayCell.append(dayCellText)
                verticalRow.append(dayCell)
                dateCounter++;
            }

        }

    }

}

function createRows() {

}