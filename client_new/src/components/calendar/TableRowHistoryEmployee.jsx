import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ReadOnlyHistoryShift from '../shift/ReadOnlyHistoryShift';
import axios from 'axios';
import { mapShiftsFromDbToTableRowHistory } from '../../mappers/calendar/DatabaseToReduxMapper';

const TableRowHistoryEmployee = ({ employeeId, shifttypes }) => {

    let { year, month } = useParams();

    const [VisualDate, setVisualDate] = useState(`${month}-${year}`);
    const [History, setHistory] = useState([]);
    const [Loading, setLoading] = useState(true);


    const getHistorie = async (datum) => {
        try {
            const { data } = await axios.get(`http://localhost:3001/api/calendar/individual/${employeeId}/year/${moment(datum, "MM-YYYY").format("YYYY")}/calendarmonth/${moment(datum, "MM-YYYY").format("MM")}`);
            let history = mapShiftsFromDbToTableRowHistory(datum, data);
            setHistory(history);

        } catch (e) {
            setHistory([]);
            console.log(e);
        }

    }



    useEffect(() => {
        getHistorie(`${month}-${year}`).then(setLoading(false));
    }, [])

    const handleDown1Month = () => {
        setLoading(true);
        getHistorie(moment(VisualDate, "MM-YYYY").subtract(1, "month").format("MM-YYYY"));
        setVisualDate(moment(VisualDate, "MM-YYYY").subtract(1, "month").format("MM-YYYY"));
        setLoading(false);

    }

    const handleUp1Month = () => {
        setLoading(true);
        getHistorie(moment(VisualDate, "MM-YYYY").add(1, "month").format("MM-YYYY"));
        setVisualDate(moment(VisualDate, "MM-YYYY").add(1, "month").format("MM-YYYY"));
        setLoading(false);

    }

    const handleDown1Year = () => {
        setLoading(true);
        getHistorie(moment(VisualDate, "MM-YYYY").subtract(1, "year").format("MM-YYYY"));
        setVisualDate(moment(VisualDate, "MM-YYYY").subtract(1, "year").format("MM-YYYY"));
        setLoading(false);

    }

    const handleUp1Year = () => {
        setLoading(true);
        getHistorie(moment(VisualDate, "MM-YYYY").add(1, "year").format("MM-YYYY"));
        setVisualDate(moment(VisualDate, "MM-YYYY").add(1, "year").format("MM-YYYY"));
        setLoading(false);
    }

    return (
        <React.Fragment>


            <td style={{ width: "auto", backgroundColor: "lightgray", textAlign: "center" }}>

                <i class="fas fa-angle-double-left fa-fw" onClick={() => handleDown1Year()}></i>
                <i class="fas fa-arrow-left fa-fw" onClick={() => handleDown1Month()} />
                {VisualDate}
                <i class="fas fa-arrow-right fa-fw" onClick={() => handleUp1Month()} />
                <i class="fas fa-angle-double-right fa-fw" onClick={() => handleUp1Year()}></i>
            </td >


            {!Loading && History && History.map(shiftDay =>

                <td style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { outline: '1px solid darkgreen', padding: "1px", width: "27px" } : { padding: "1px", width: "27px" }}>
                    <ReadOnlyHistoryShift shift={shiftDay.shift !== "" ? shifttypes.find(x => x.naam === shiftDay.shift) : null} shiftDay={shiftDay} />
                </td>
            )}
        </React.Fragment>
    )
}

export default TableRowHistoryEmployee