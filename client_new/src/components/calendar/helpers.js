import moment from 'moment';

const getCalendarMoments_ArrayWithMoments = dateString =>{
    let calendar = [];
    const date = moment(dateString, "MM-YYYY");
    let startDay = date.clone().startOf('month').startOf('isoWeek');
    const endDay = date.clone().endOf('month').endOf('isoWeek').add(1, 'day');


    while (startDay.isBefore(endDay, 'day')) {
        calendar.push(startDay);
        startDay = startDay.add(1, 'day');
    };

    return calendar;
}

export {getCalendarMoments_ArrayWithMoments}