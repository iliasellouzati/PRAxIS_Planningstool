const MinimumOperators = ({
    calendar,
    calendarMonthHelper,
    shifttypes
}) => {

    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper < calendarMonthHelper.length; individualDayLooper++) {
        let minimum = 4;
        let counter = 0;
        if ((calendarMonthHelper[individualDayLooper].isoWeekday() === 6 || calendarMonthHelper[individualDayLooper].isoWeekday() === 7)) {
            minimum = 3;
        }

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            if (calendar[employeeLooper].calendar[individualDayLooper].shift === "") {
                counter++;
            }
        }
        if (minimum > counter) {
            hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format("DD-MM-YYYY"))
        }
    }

    return hulpArrMetDeDagen;

}



export {
    MinimumOperators
}