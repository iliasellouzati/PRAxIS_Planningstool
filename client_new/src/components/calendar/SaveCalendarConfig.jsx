import axios from 'axios';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from './helpers';
import { mapReduxCalendarToSavedCalendarInDb } from '../../mappers/calendar/ReduxToDatabaseMapper'

const SaveCalendarConfig = ({setShowSuccesModal, employees, shifttypes, setShowFinalComment }) => {

    let { year, month, version } = useParams();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;
    const [Disabled, setDisabled] = useState(0);

    const history = useHistory();


    const [ShowLastMonth, setShowLastMonth] = useState(true);
    const [LastMonth, setLastMonth] = useState([]);
    const [ShiftsInLastMonth, setShiftsInLastMonth] = useState(0);

    const [Commentaar, setCommentaar] = useState(`Planning ${month}-${year} Versie ${version}: `);

    const getlastCalendarStatusFromDB = async () => {

        const { data } = await axios.get(`http://localhost:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM")}`);
        if (data) {
            setLastMonth(data[0]);
            setDisabled(Disabled => Disabled + 1);
        } else {
            setLastMonth(false);
        }
    }

    const postNewLastCalenderStatusIn = async () => {
        await axios.post(
            `http://127.0.0.1:3001/api/statuscalendar/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM")}`,
            {
                "timestamp": moment().format("DD/MM/YYYY HH:MM"),
                "version": 1,
                'progress': 1
            })
            .then(() => { getlastCalendarStatusFromDB(); })
            .catch(error => console.log(error));
    }



    const [ShowNextMonth, setShowNextMonth] = useState(true);
    const [NextMonth, setNextMonth] = useState([]);
    const [ShiftsInNextMonth, setShiftsInNextMonth] = useState(0);



    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);

    const calculateShiftsInLastMonth = () => {
        const LastDayOflastMonth = moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").endOf('month').endOf('isoWeek').add(1, 'day');
        let counter = 0;

        calendar.forEach(indivCal => indivCal.calendar.forEach(shiftDay => {
            if (shiftDay.shift !== '' && moment(shiftDay.day, "DD-MM-YYYY").isBefore(LastDayOflastMonth, 'day'))
                counter++;
        }))
        setShiftsInLastMonth(counter);
    }

    const getNextCalendarStatusFromDB = async () => {

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

        if (version === '1') {
            await axios.put(`http://localhost:3001/api/statuscalendar/${year}/${month}/${version}`, {
                'progress': 2,
                'comment': Commentaar,
                'affected_employees': employees.length,
                'added_shifts': result.status,
                'same_shifts': 0,
                'deleted_shifts': 0,
                'changed_shifts': 0,
                'timestamp': moment().format("DD/MM/YYYY HH:MM")
            }).then(()=>{
                setShowSuccesModal([true,['Opgeslagen',`ID: ${month}-${year}_V${version}`,`Planning ${month}-${year}_V${version} met ${result} nieuwe shiften werd opgeslagen! `]]);
                history.push(`/planningen/${year}`);
            })
        }
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
                                {(!LastMonth || LastMonth.progress !== 1) ?
                                    <React.Fragment>
                                        <p style={{ margin: "0px" }}> Overlappende shifts: <span style={{ color: 'red' }}>{ShiftsInLastMonth}</span> </p>
                                        <span style={{ alignItems: 'baseline' }} > Kalender aanmaken :
                                            <button type="button" class="btn  btn-warning btn-xs" onClick={() => { postNewLastCalenderStatusIn() }} style={{ width: '100px', marginLeft: '10px' }}> {moment(`${month}-${year}`, "MM-YYYY").subtract(1, "month").format("MM-YYYY")}_V1</button>
                                        </span>
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
                        {!ShowNextMonth ? <p>N.V.T.</p> : <p>Not Implemented yet</p>}
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
                <button type="button" className="btn btn-success" style={{ width: "100px" }} disabled={Disabled === 2 ? false : true} onClick={() => saveCalendarInDb()} >opslaan</button>

            </div>
        </React.Fragment>
    )
}

export default SaveCalendarConfig