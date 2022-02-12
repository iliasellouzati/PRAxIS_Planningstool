import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ShiftDayVisual from './ShiftDayVisual';
import * as MOMENT_OPERATIONS from '../../moment_operations';


const HistoryEmployeeCalendar2 = ({ employeeId, cssWidthDay, datum }) => {

    const [ExtraHistorieEmployee, setExtraHistorieEmployee] = useState();
    const [VisualDatum, setVisualDatum] = useState();

    const [Loading, setLoading] = useState(false)




    const getHistorie = async (nieuweDatum) => {

        let { data } = await axios.get("/api/planning/" + employeeId + "/" + nieuweDatum);
        let calenderLength = MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum,"MM-YYYY"));
        if(calenderLength===28){
            data=  data.slice(0,28);
          } else if(calenderLength===35 && data.length>35){
          data=  data.slice(0,35);
        }
        setExtraHistorieEmployee( data);
        setLoading(false);
    }

    const handleDown1Month = () => {
        setLoading(true);        
        getHistorie(moment(VisualDatum, "MM-YYYY").subtract(1, "month").format("MM-YYYY"));

        setVisualDatum(moment(VisualDatum, "MM-YYYY").subtract(1, "month").format("MM-YYYY"));
    }

    const handleUp1Month = () => {
        setLoading(true); 
        getHistorie(moment(VisualDatum, "MM-YYYY").add(1, "month").format("MM-YYYY"));

        setVisualDatum(moment(VisualDatum, "MM-YYYY").add(1, "month").format("MM-YYYY"));
    }

    const handleDown1Year = () => {
        setLoading(true);        
        getHistorie(moment(VisualDatum, "MM-YYYY").subtract(1, "year").format("MM-YYYY"));

        setVisualDatum(moment(VisualDatum, "MM-YYYY").subtract(1, "year").format("MM-YYYY"));
    }

    const handleUp1Year = () => {
        setLoading(true); 
        getHistorie(moment(VisualDatum, "MM-YYYY").add(1, "year").format("MM-YYYY"));

        setVisualDatum(moment(VisualDatum, "MM-YYYY").add(1, "year").format("MM-YYYY"));
    }




    useEffect(() => {
        
        setLoading(true); 
        setVisualDatum(datum);
       getHistorie(datum);
       
        
        return () => {

        }
    }, [])



    return (
        <>

            <td style={{ width: "auto", backgroundColor: "lightgray",textAlign:"center" }}>

                <i class="fas fa-angle-double-left fa-fw" onClick={() => handleDown1Year()}></i>
                <i class="fas fa-arrow-left fa-fw" onClick={() => handleDown1Month()} />
                {VisualDatum}
                <i class="fas fa-arrow-right fa-fw" onClick={() => handleUp1Month()} />
                <i class="fas fa-angle-double-right fa-fw" onClick={() => handleUp1Year()}></i>

            </td >

            {!Loading && ExtraHistorieEmployee && ExtraHistorieEmployee.map(shiftDay =>
                <td style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: "auto" } : { padding: "1px", width: "auto" }}>

                    <ShiftDayVisual employeeId={employeeId} shiftDay={shiftDay} />

                </td>
            )
            }
            {!Loading && ExtraHistorieEmployee &&<td colSpan="3" style={{ width: "auto",  fontSize: '12px', margin: "0px", padding: "0px" , textAlign:"center", backgroundColor:"lightgray" }}>{moment(ExtraHistorieEmployee[0].day,"DD-MM-YYYY").format("DD-MM")} tot {moment([...ExtraHistorieEmployee].pop().day,"DD-MM-YYYY").format("DD-MM")}  </td>  }


            




        </>

    )
}

export default HistoryEmployeeCalendar2


