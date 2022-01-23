import moment from 'moment';

let datum = '10-2021'
let calendarmoment = moment(datum,'MM-YYYY')
let var1 = 12;
let var2= 5;
for (let index = 1; index <= var2; index++) {
    if (index ===var2) {
        console.log("lijst " +index+ " = " + (Math.floor( var1/var2)+((var1%var2))))

    }else(
    console.log("lijst " +index+ " = " + Math.floor( var1/var2))
    )
}
