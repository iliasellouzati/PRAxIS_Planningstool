import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { addShift } from '../../redux/actions/calendarActions';

const ReadAndWriteShiftContextMenu = ({ employees, setContextMenu, content }) => {

    const dispatch = useDispatch();
    const [Shift, setShift] = useState('')

    const [EmptyShift, setEmptyShift] = useState(false);
    const [AutoUpdateStandby, setAutoUpdateStandby] = useState(false)
    const [OperatorShift, setOperatorShift] = useState(false);
    const [Begin, setBegin] = useState('');
    const [End, setEnd] = useState('');

    const TOP = content.e.pageY - 25;
    const LEFT = content.e.pageX > 1600 ? 1600 : content.e.pageX - 25;

    const submitHandler = () => {
        dispatch(addShift({
            'id': content.employeeId,
            'day': content.shiftDay.day,
            'shift': content.shiftDay.shift,
            'startmoment': Begin,
            'endmoment': End
        }));
        setContextMenu([false, []]);

    }

    useEffect(() => {
        let shift;
        switch (content.shiftDay.shift) {
            case '':
                setEmptyShift(true);
                break;
            case '0618':
            case '0719':
            case '1806':
            case '1907':
                shift = content.shifttypes.find(x => x.naam === content.shiftDay.shift);
                setShift(shift);
                setBegin(content.shiftDay.startmoment || shift.beginuur);
                setEnd(content.shiftDay.endmoment || shift.einduur);
                setOperatorShift(true);

                break;
            default:
                shift = content.shifttypes.find(x => x.id === content.shiftDay.shift);
                setShift(shift);
                setBegin(shift.beginuur);
                setEnd(shift.einduur);

                break;
        }

    }, [])


    return (
        <div
            onContextMenu={(e) => { e.preventDefault() }}
            onMouseLeave={() => setContextMenu([false, []])}
            style={{ zIndex: 1, position: 'fixed', width: "250px", opacity: '85%', top: TOP, left: LEFT }} >



            {EmptyShift ?
                <div className="card" style={{ borderLeft: "3px solid red", borderRight: "3px solid red" }}>
                    <div className="card-header">
                        Lege shift geselecteerd
                    </div>
                </div>
                :
                <div style={{ backgroundColor: 'white', borderRadius: '5px', padding: '2px', border: "2px dashed red", fontSize: '15px' }}>

                    <div style={{ textAlign: 'center' }}>
                        <b style={{ textDecorationLine: 'underline' }}>{content.shiftDay.shift}</b>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: '30px' }}>
                        <label for="BEGIN_UREN">Begin:</label>
                        <input type="time" id="BEGIN_UREN" value={Begin} onChange={(e) => setBegin(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: '30px' }}>
                        <label for="EIND_UREN">Eind:</label>
                        <input type="time" id="EIND_UREN" value={End} onChange={(e) => setEnd(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: '30px' }}>
                        <label >Totaal:</label>
                        {Shift !== '' &&
                            <p>
                                {
                                    moment.utc(moment.duration(moment(End, "hh:mm").diff(moment(Begin, "hh:mm"))).asMilliseconds()).format("hh:mm") > 0 ?
                                        moment.utc(moment.duration(moment(End, "hh:mm").diff(moment(Begin, "hh:mm"))).asMilliseconds()).format("hh:mm") :
                                        moment.utc(moment.duration(moment(End, "hh:mm").add(1, "day").diff(moment(Begin, "hh:mm"))).asMilliseconds()).format("HH:mm")
                                }
                            </p>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', height: '30px' }}>
                        <label >Totaal:</label>
                        {Shift !== '' &&
                            <p>
                                {
                                    Math.round((moment.duration(moment(End, "hh:mm").diff(moment(Begin, "hh:mm"))).asHours() > 0 ?
                                        moment.duration(moment(End, "hh:mm").diff(moment(Begin, "hh:mm"))).asHours() :
                                        moment.duration(moment(End, "hh:mm").add(1, "day").diff(moment(Begin, "hh:mm"))).asHours()) * 100) / 100
                                }
                            </p>}
                    </div>


                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'baseline', height: '45px' }}>

                        <button type="button" class="btn btn-block btn-warning btn-xs" style={{ width: "60px" }} onClick={() => setContextMenu([false, []])} >annuleer</button>
                        <button type="button" class="btn btn-block btn-success btn-xs" style={{ width: "60px" }} onClick={() => submitHandler()}>opslaan</button>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center', alignItems: 'baseline', height: '20px', backgroundColor: 'lightgrey' }}>
                        <label>
                            ID:
                        </label>
                        <p>
                            {employees.find(x => x.id === content.employeeId).voornaam}
                        </p>
                        <label>
                            DATUM:
                        </label>
                        <p>
                            {content.shiftDay.day}
                        </p>
                    </div>
                </div>
            }



        </div >
    )
}

export default ReadAndWriteShiftContextMenu