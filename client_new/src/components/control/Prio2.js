import moment from 'moment';

const CoopmanShiftControle = ({calendar,calendarMonthHelper,shifttypes}) => {

    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper  < calendarMonthHelper.length ; individualDayLooper++) {
        if ((calendarMonthHelper[individualDayLooper].isoWeekday() === 6 || calendarMonthHelper[individualDayLooper].isoWeekday() === 7)){
            continue;
        }
        hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format("DD-MM-YYYY"));

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if(shift!=="" &&  shifttypes.find(s => s.naam === shift)?.categorie.trim() === "coopman"){
                hulpArrMetDeDagen.pop();
                break;
            }
        }
    }

    return hulpArrMetDeDagen;

}




export {CoopmanShiftControle}