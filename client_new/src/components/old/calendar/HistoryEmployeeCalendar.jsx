import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ShiftDay from './ShiftDay';

const HistoryEmployeeCalendar = ({ employeeId, cssWidthDay }) => {

    const [ExtraHistorieEmployee, setExtraHistorieEmployee] = useState();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum } = currentCalendar;

    const getHistorie = async (id) => {

        const { data } = await axios.get("/api/planning/" + employeeId + "/" + datum);
        setExtraHistorieEmployee(data);
    }

    useEffect(() => {

        getHistorie();
        return () => {

        }
    }, [])
    return (
        <div style={{ height: "75px", minWidth: "50%", maxWidth: "300%", overflowX: "scroll", whiteSpace: "nowrap", display: "block", backgroundColor: "lightcyan", padding: "0px", margin:"0px", border: "2px solid red" }} >

            {/* HISTORIE DIV */}
            <div style={{ border: "1px solid black", width: "100%", display: "block", whiteSpace: "nowrap" }}>


                <div style={{  display: "inline-block", width:"178px" }}>
                    <i class="fas fa-times fa-fw"></i>
                    <i class="fas fa-arrow-left fa-fw"></i>
                    {datum}
                    <i class="fas fa-arrow-right fa-fw"></i>

                </div>

                {ExtraHistorieEmployee && ExtraHistorieEmployee.map(shiftDay =>
                    <div style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { display: "inline-block", whiteSpace: "nowrap", border: '2px solid darkgreen',  width: { cssWidthDay }, height: "100%" } : { display: "inline-block", whiteSpace: "nowrap",  width: { cssWidthDay } }}>
                        
                        <div style={{width:"40px",margin:"1px", height:'25px'}}>x</div>
                    </div>

                )}



                <div style={{ border: "1px solid black", display: "inline-block" }}>
                    div 1
                </div>

                <div style={{ border: "1px solid black", display: "inline-block", padding: "1px", width: { cssWidthDay }, margin: "0px" }}>1</div>
                <div style={{ border: "1px solid black", display: "inline-block", padding: "1px", width: { cssWidthDay }, margin: "0px" }}>2</div>
                <div style={{ border: "1px solid black", display: "inline-block", padding: "1px", width: { cssWidthDay }, margin: "0px" }}>3</div>

            </div>
            <div>
                div 2
            </div>


        </div>
    )
}

export default HistoryEmployeeCalendar


