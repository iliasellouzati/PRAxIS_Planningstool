import moment from 'moment';

moment.prototype.startDayOfMonth = function () {
    return this.clone().startOf("month").startOf("isoWeek");
}

moment.prototype.endDayOfMonth = function (){
    return this.clone().endOf("month").endOf("isoWeek");
}


export default moment.prototype;
