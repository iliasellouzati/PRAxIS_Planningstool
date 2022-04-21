import axios from 'axios';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from './helpers';
import { mapReduxCalendarToSavedCalendarInDb } from '../../mappers/calendar/ReduxToDatabaseMapper'

const SaveCalendarConfig = ({ setShowSuccesModal, employees, shifttypes, setShowFinalComment }) => {

    let { year, month, version } = useParams();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;
    const [Disabled, setDisabled] = useState(0);

    const history = useHistory();


    const [ShowLastMonth, setShowLastMonth] = useState(true);
    const [LastMonth, setLastMonth] = useState([]);
    const [ShiftsInLastMonth, setShiftsInLastMonth] = useState(0);
    const [DifferenceWithLastSavedCalendar, setDifferenceWithLastSavedCalendar] = useState(0);
    const [DifferenceWithNextSavedCalendar, setDifferenceWithNextSavedCalendar] = useState(0);

    const [Commentaar, setCommentaar] = useState(`Planning ${month}-${year} Versie ${version}: `);

    const getlastCalendarStatusFromDB = async () => {

        const { data } = await axios.get(`http://localhost:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM")}`);
        if (data) {
            setLastMonth(data[0]);
            if (data[0].progress === 2) {
                checkDifferendeWithLastSavedCalendar(data[0].version);
            } else {
                setDisabled(Disabled => Disabled + 1);

            }
        } else {
            setLastMonth(false);
        }
    }
    const checkDifferendeWithLastSavedCalendar = async (lastVersion) => {
        let { data } = await axios.get(`http://localhost:3001/api/calendar/global/year/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("YYYY")}/calendarmonth/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM")}/version/${lastVersion}`);
        const beginDatumEersteWeek = moment(`${month}-${year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day');
        const eindDatumEersteWeek = moment(`${month}-${year}`, "MM-YYYY").startOf('month').endOf('isoWeek').add(1, 'day');

        const savedShifts = data.filter(x => moment(x.shift_datum, "DD-MM-YYYY").isBetween(beginDatumEersteWeek, eindDatumEersteWeek));
        let reduxShifts = [];

        calendar.forEach(empCal => {
            reduxShifts = [...reduxShifts, ...empCal.calendar.filter(x => moment(x.day, "DD-MM-YYYY").isBetween(beginDatumEersteWeek, eindDatumEersteWeek) && x.shift !== "").map(sh => ({ ...sh, 'employeeId': empCal.employeeId }))];
        })

        let extraInRedux = reduxShifts.filter(reduxShift => reduxShift.shift !== false &&
            !savedShifts.some(savedShift => (
                savedShift.shift_datum === reduxShift.day &&
                savedShift.werknemer_id === reduxShift.employeeId &&
                savedShift.shift_shifttypes_naam === reduxShift.shift &&
                savedShift.shift_beginuur === reduxShift.startmoment &&
                savedShift.shift_einduur === reduxShift.endmoment)));

        let extraInSavedShifts = savedShifts.filter(savedShift =>
            !reduxShifts.some(reduxShift => (
                savedShift.shift_datum === reduxShift.day &&
                savedShift.werknemer_id === reduxShift.employeeId &&
                savedShift.shift_shifttypes_naam === reduxShift.shift &&
                savedShift.shift_beginuur === reduxShift.startmoment &&
                savedShift.shift_einduur === reduxShift.endmoment)));

        setDifferenceWithLastSavedCalendar(extraInRedux.length + extraInSavedShifts.length);
        if ((extraInRedux.length + extraInSavedShifts.length) === 0) {
            setDisabled(Disabled => Disabled + 1);
        }


    }
    const checkDifferendeWithNextSavedCalendar = async (lastVersion) => {
        let { data } = await axios.get(`http://localhost:3001/api/calendar/global/year/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("YYYY")}/calendarmonth/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("MM")}/version/${lastVersion}`);
        const beginDatumEersteWeek = moment(`${month}-${year}`, "MM-YYYY").endOf('month').startOf('isoWeek').subtract(1, 'day');
        const eindDatumEersteWeek = moment(`${month}-${year}`, "MM-YYYY").endOf('month').endOf('isoWeek').add(1, 'day');

        const savedShifts = data.filter(x => moment(x.shift_datum, "DD-MM-YYYY").isBetween(beginDatumEersteWeek, eindDatumEersteWeek));
        let reduxShifts = [];

        calendar.forEach(empCal => {
            reduxShifts = [...reduxShifts, ...empCal.calendar.filter(x => moment(x.day, "DD-MM-YYYY").isBetween(beginDatumEersteWeek, eindDatumEersteWeek) && x.shift !== "").map(sh => ({ ...sh, 'employeeId': empCal.employeeId }))];
        })

        let extraInRedux = reduxShifts.filter(reduxShift => reduxShift.shift !== false &&
            !savedShifts.some(savedShift => (
                savedShift.shift_datum === reduxShift.day &&
                savedShift.werknemer_id === reduxShift.employeeId &&
                savedShift.shift_shifttypes_naam === reduxShift.shift &&
                savedShift.shift_beginuur === reduxShift.startmoment &&
                savedShift.shift_einduur === reduxShift.endmoment)));

        let extraInSavedShifts = savedShifts.filter(savedShift =>
            !reduxShifts.some(reduxShift => (
                savedShift.shift_datum === reduxShift.day &&
                savedShift.werknemer_id === reduxShift.employeeId &&
                savedShift.shift_shifttypes_naam === reduxShift.shift &&
                savedShift.shift_beginuur === reduxShift.startmoment &&
                savedShift.shift_einduur === reduxShift.endmoment)));

        setDifferenceWithNextSavedCalendar(extraInRedux.length + extraInSavedShifts.length);
        if ((extraInRedux.length + extraInSavedShifts.length) === 0) {
            setDisabled(Disabled => Disabled + 1);
        }


    }

    const postNewLastCalenderStatusIn = async () => {
        await axios.post(
            `http://127.0.0.1:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM")}`,
            {
                "timestamp": moment().format("DD/MM/YYYY HH:MM"),
                "version": LastMonth ? LastMonth.version + 1 : 1,
                'progress': 1
            })
            .then(() => { getlastCalendarStatusFromDB(); })
            .catch(error => console.log(error));
    }
    const calculateShiftsInLastMonth = () => {
        const LastDayOflastMonth = moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").endOf('month').endOf('isoWeek').add(1, 'day');
        let counter = 0;

        calendar.forEach(indivCal => indivCal.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== '' && shiftDay.shift !== false && moment(shiftDay.day, "DD-MM-YYYY").isBefore(LastDayOflastMonth, 'day'))
                counter++;
        }))
        setShiftsInLastMonth(counter);
        if (counter === 0) {
            setDisabled(Disabled => Disabled + 1);

        }
    }


    const [ShowNextMonth, setShowNextMonth] = useState(true);
    const [NextMonth, setNextMonth] = useState([]);
    const [ShiftsInNextMonth, setShiftsInNextMonth] = useState(0);



    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);



    const getNextCalendarStatusFromDB = async () => {
        const { data } = await axios.get(`http://localhost:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("MM")}`);
        if (data) {
            setNextMonth(data[0]);
            if (data[0].progress === 2) {
                checkDifferendeWithNextSavedCalendar(data[0].version);
            } else {
                setDisabled(Disabled => Disabled + 1);

            }
        } else {
            setNextMonth(false);
        }

    }

    const postNewNextCalenderStatusIn = async () => {
        await axios.post(
            `http://127.0.0.1:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("MM")}`,
            {
                "timestamp": moment().format("DD/MM/YYYY HH:MM"),
                "version": NextMonth ? NextMonth.version + 1 : 1,
                'progress': 1
            })
            .then(() => { getNextCalendarStatusFromDB(); })
            .catch(error => console.log(error));
    }
    const calculateShiftsInNextMonth = () => {
        const LastDayOflastMonth = moment(`${month}-${year}`, "MM-YYYY").add(1, "month").startOf('month').startOf('isoWeek').subtract(1, 'day');
        let counter = 0;

        calendar.forEach(indivCal => indivCal.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== '' && shiftDay.shift !== false && moment(shiftDay.day, "DD-MM-YYYY").isAfter(LastDayOflastMonth, 'day'))
                counter++;
        }))
        setShiftsInNextMonth(counter);
        if (counter === 0) {
            setDisabled(Disabled => Disabled + 1);

        }
    }




    const saveCalendarInDb = async () => {

        let calendarForDb = mapReduxCalendarToSavedCalendarInDb({
            "versie": `${month}-${year}_V${version}`,
            "calendar": calendar,
            "employees": employees,
            "shifttypes": shifttypes
        });
        let byteSize = new Blob([...calendarForDb]).size;
        let MBSize = (byteSize / 1024).toFixed(2);

        console.log(`Calendar in Bytes: ${byteSize} B`);
        console.log(`Calendar in MB: ${MBSize} MB`);
        let result = await axios.post(`http://localhost:3001/api/calendar/global/year/${year}/calendarmonth/${month}/version/${version}`, { 'calendarForDb': calendarForDb });


        await axios.put(`http://localhost:3001/api/statuscalendar/${year}/${month}/${version}`, {
            'progress': 2,
            'comment': Commentaar,
            'affected_employees': employees.length,
            'added_shifts': result.status,
            'same_shifts': 0,
            'deleted_shifts': 0,
            'changed_shifts': 0,
            'timestamp': moment().format("DD/MM/YYYY HH:MM")
        }).then(() => {
            setShowSuccesModal([true, ['Opgeslagen', `ID: ${month}-${year}_V${version}`, `Planning ${month}-${year}_V${version} met ${result} nieuwe shiften werd opgeslagen! `]]);
            history.push(`/planningen/${year}`);
        })

    }





    useEffect(() => {
        if (calendarMonthHelper[0].isSame(moment(`${month}-${year}`, "MM-YYYY"), "month")) {
            setShowLastMonth(false);
            setDisabled(Disabled => Disabled + 1);
        } else {
            getlastCalendarStatusFromDB();
            calculateShiftsInLastMonth();
        }

        if (calendarMonthHelper[calendarMonthHelper.length - 1].isSame(moment(`${month}-${year}`, "MM-YYYY"), "month")) {
            setShowNextMonth(false);
            setDisabled(Disabled => Disabled + 1);
        } else {
            getNextCalendarStatusFromDB();
            calculateShiftsInNextMonth();

        }
    }, [])

    return (
        <React.Fragment>
            <div className="col-3">
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        {`Voor maand ${moment(`${month}-${year}`, 'MM-YYYY').subtract(1, 'month').format("MM-YYYY")}`}
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        {!ShowLastMonth ? <p>N.V.T.</p> :
                            <React.Fragment>
                                <p style={{ margin: "0px" }} > Huidige staat: {LastMonth ?
                                    ({
                                        undefined: <span className="badge bg-primary" style={{ marginLeft: "10px" }}>leeg</span>,
                                        0: <span className="badge bg-primary" style={{ marginLeft: "10px" }}>leeg</span>,
                                        1: <span className="badge bg-warning" style={{ marginLeft: "10px" }}>bezig</span>,
                                        2: <span className="badge bg-success" style={{ marginLeft: "10px" }}>klaar</span>
                                    }[LastMonth.progress]) :
                                    <span style={{ color: 'red' }}>GEEN PLANNING</span>}</p>
                                {(ShowLastMonth !== false) ?
                                    <React.Fragment>
                                        {LastMonth === false ?
                                            <React.Fragment>
                                                <p style={{ margin: "0px" }}> Overlappende shifts: <span style={{ color: 'red' }}>{ShiftsInLastMonth}</span> </p>
                                                <span style={{ alignItems: 'baseline' }} > Kalender aanmaken :
                                                    <button type="button" class="btn  btn-warning btn-xs" onClick={() => { postNewLastCalenderStatusIn() }} style={{ width: '100px', marginLeft: '10px' }}> {moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM-YYYY")}_V1</button>
                                                </span>
                                            </React.Fragment>
                                            : LastMonth.progress === 2 ?
                                                <React.Fragment>
                                                    <p style={{ margin: "0px" }}>Aangepaste shifts t.o.v. planning {`${LastMonth.month}_V${LastMonth.version}`}:<span style={{ color: 'red' }}> {DifferenceWithLastSavedCalendar}</span> </p>
                                                    {DifferenceWithLastSavedCalendar !== 0 ?
                                                        <span style={{ alignItems: 'baseline' }} > Kalender aanmaken :
                                                            <button type="button" class="btn  btn-warning btn-xs" onClick={() => { postNewLastCalenderStatusIn() }} style={{ width: '100px', marginLeft: '10px' }}> {moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM-YYYY")}_V{LastMonth.version + 1}</button>
                                                        </span> :
                                                        <span style={{ alignItems: 'baseline' }} > N.V.T. </span>}

                                                </React.Fragment> :
                                                <React.Fragment>

                                                    <span style={{ alignItems: 'baseline' }} > N.V.T. </span>

                                                </React.Fragment>
                                        }
                                    </React.Fragment> :
                                    <p>Geen actie nodig</p>}
                            </React.Fragment>}
                    </div>
                </div>
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        {`Voor maand ${moment(`${month}-${year}`, 'MM-YYYY').add(1, 'month').format("MM-YYYY")}`}
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        {!ShowNextMonth ? <p>N.V.T.</p> :
                            <React.Fragment>
                                <p style={{ margin: "0px" }} > Huidige staat: {NextMonth ?
                                    ({
                                        undefined: <span className="badge bg-primary" style={{ marginLeft: "10px" }}>leeg</span>,
                                        0: <span className="badge bg-primary" style={{ marginLeft: "10px" }}>leeg</span>,
                                        1: <span className="badge bg-warning" style={{ marginLeft: "10px" }}>bezig</span>,
                                        2: <span className="badge bg-success" style={{ marginLeft: "10px" }}>klaar</span>
                                    }[NextMonth.progress]) :
                                    <span style={{ color: 'red' }}>GEEN PLANNING</span>}</p>
                                {(ShowNextMonth !== false) ?
                                    <React.Fragment>
                                        {NextMonth === false ?
                                            <React.Fragment>
                                                <p style={{ margin: "0px" }}> Overlappende shifts: <span style={{ color: 'red' }}>{ShiftsInNextMonth}</span> </p>
                                                {ShiftsInNextMonth !== 0 ? <span style={{ alignItems: 'baseline' }} > Kalender aanmaken :
                                                    <button type="button" class="btn  btn-warning btn-xs" onClick={() => { postNewNextCalenderStatusIn() }} style={{ width: '100px', marginLeft: '10px' }}> {moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("MM-YYYY")}_V1</button>
                                                </span> : <span style={{ alignItems: 'baseline' }} > N.V.T. </span>}
                                            </React.Fragment>
                                            : LastMonth.progress === 2 ?
                                                <React.Fragment>
                                                    <p style={{ margin: "0px" }}>Aangepaste shifts t.o.v. planning {`${NextMonth.month}_V${NextMonth.version}`}:<span style={{ color: 'red' }}> {DifferenceWithNextSavedCalendar}</span> </p>
                                                    {DifferenceWithNextSavedCalendar !== 0 ?
                                                        <span style={{ alignItems: 'baseline' }} > Kalender aanmaken :
                                                            <button type="button" class="btn  btn-warning btn-xs" onClick={() => { postNewNextCalenderStatusIn() }} style={{ width: '100px', marginLeft: '10px' }}> {moment(`${month}-${year}`, "MM-YYYY").add(1, "month").format("MM-YYYY")}_V{NextMonth.version + 1}</button>
                                                        </span> :
                                                        <span style={{ alignItems: 'baseline' }} > N.V.T. </span>}
                                                </React.Fragment> :
                                                <React.Fragment>

                                                    <span style={{ alignItems: 'baseline' }} > N.V.T. </span>

                                                </React.Fragment>
                                        }
                                    </React.Fragment> :
                                    <p>Geen actie nodig</p>}
                            </React.Fragment>}
                    </div>
                </div>
            </div>
            <div className="col-7">
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        Commentaar
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <textarea rows={5} style={{ width: '95%' }} value={Commentaar} onChange={(e) => setCommentaar(e.target.value)} >
                            {`Planning ${month}-${year} Versie ${version}:`}
                        </textarea>  </div>
                </div>
            </div>
            <div className="col-2" style={{ display: "flex", justifyContent: "space-around", height: "50px" }}>
                <button type="button" className="btn btn-warning" style={{ width: "100px" }} onClick={() => setShowFinalComment(false)} >annuleren</button>
                <button type="button" className="btn btn-success" style={{ width: "100px" }} disabled={Disabled >= 2 ? false : true} onClick={() => saveCalendarInDb()} >opslaan</button>

            </div>
        </React.Fragment>
    )
}

export default SaveCalendarConfig