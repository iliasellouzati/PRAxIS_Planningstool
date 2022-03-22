import moment from 'moment';

const dayShifts = ["0618", "0719"];
const nightShifts = ["1806", "1907"];
const operatorShifts=["0618","0719","1806","1907"];

const StandbyControle = ({calendar,calendarMonthHelper,shifttypes})  =>{

    let hulpArrMetDeDagen = [];

    for (let individualDayLooper = 0; individualDayLooper  < calendarMonthHelper.length ; individualDayLooper++) {

        hulpArrMetDeDagen.push(calendarMonthHelper[individualDayLooper].format("DD-MM-YYYY"));

        for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift;
            if(shift!=="" &&  shifttypes.find(s => s.naam === shift)?.categorie.trim() === "standby"){
                hulpArrMetDeDagen.pop();
                break;
            }
        }
    }

    return hulpArrMetDeDagen;

}

const Max4OperatorShifts = ({calendar,calendarMonthHelper,shifttypes}) =>{

let result= [];


let shiftCounter= 0;

for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

    for (let individualDayLooper = 0; individualDayLooper  < calendarMonthHelper.length ; individualDayLooper++) {

        let shift = calendar[employeeLooper].calendar[individualDayLooper].shift

        if(operatorShifts.some(x=>x===shift)){
            shiftCounter++;
        }else{
            shiftCounter=0;
        }

        if(shiftCounter>4){
            if(result.length!==0&&result[result.length-1].start===calendarMonthHelper[individualDayLooper+1-shiftCounter]&&result[result.length-1].employeeId===calendar[employeeLooper].employeeId){
                result.pop();
            }
            result.push({'employeeId':calendar[employeeLooper].employeeId,'start':calendarMonthHelper[individualDayLooper+1-shiftCounter],'end':calendarMonthHelper[individualDayLooper]})
        }
    }
}

return result;
}


const DagNaNacht =({calendar,calendarMonthHelper,shifttypes})=>{
    let result=[];

    for (let employeeLooper = 0; employeeLooper < calendar.length; employeeLooper++) {

        for (let individualDayLooper = 1; individualDayLooper  < calendarMonthHelper.length ; individualDayLooper++) {
            
            let shift = calendar[employeeLooper].calendar[individualDayLooper].shift
            let passedShift = calendar[employeeLooper].calendar[individualDayLooper-1].shift
            if(nightShifts.some(x=>x===passedShift)&&dayShifts.some(x=>x===shift)){
                result.push({'employeeId':calendar[employeeLooper].employeeId,'start':calendarMonthHelper[individualDayLooper-1],'end':calendarMonthHelper[individualDayLooper]})
           }
        }
    }

    return result;
}


export {StandbyControle,Max4OperatorShifts,DagNaNacht}