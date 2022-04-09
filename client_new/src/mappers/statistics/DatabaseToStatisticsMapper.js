import moment from "moment";

const makeObjectForAutomatisation = (ShiftsFromDb, shifttypes,monthYear) => {
    let returnObject = {};
   

    ShiftsFromDb.forEach((shift) => {
        let shiftObj = shifttypes.find(x => x.naam === shift.shifttypes_naam)

        if (typeof returnObject[`${shift.werknemers_id}`] === 'undefined') {
            returnObject[`${shift.werknemers_id}`] = {'order_by_cat':makeIndividualStatsObject(shifttypes), 'history':makeIndividualHistoryObject(monthYear)};


        }

        if(typeof returnObject[`${shift.werknemers_id}`]['order_by_cat'][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] ==='undefined'){
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`] =1;
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`]=shift.shifttypes_naam;
        }else{
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`totaal`]++;
            returnObject[`${shift.werknemers_id}`][`order_by_cat`][`${shiftObj.categorie.trim()}`][`${shiftObj.naam}`]++; 
            returnObject[`${shift.werknemers_id}`][`history`][`${moment(shift.datum,"YYYY-MM-DD").format("DD-MM-YYYY")}`]=shift.shifttypes_naam;

        }





    })



    return returnObject;

}
const makeIndividualHistoryObject = (monthYear)=>{
    let endDay = moment(monthYear,"MM-YYYY").endOf('month').endOf('isoWeek');
    let loopDay = endDay.clone().startOf('year');

    let returnObject = {};

    let aantalDays= endDay.diff(loopDay,'day');

    for (let index = 0; index < aantalDays; index++) {
       returnObject[`${loopDay.format("DD-MM-YYYY")}`] = ''
        loopDay.add(1,'day');
    }

return returnObject;

}

const makeIndividualStatsObject = (shifttypes) => {

    let returnObject = {};
    let shiftCategorien = calculateCategories(shifttypes);

    shiftCategorien.forEach((catName)=>{
        returnObject[`${catName}`]={'totaal':0}
    })

return returnObject;
}

const calculateCategories = (AllShifts) => {
    let cat = [];
    AllShifts.forEach(shift => {
        if (!cat.some(x => x.trim() === shift.categorie.trim())) {
            cat.push(shift.categorie.trim());
        }
    });
    return cat;
}






export {
    makeObjectForAutomatisation
}