import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from './helpers';

const SaveCalendarConfig = ({ setShowFinalComment }) => {

    let { year, month, version } = useParams();

    const [LastMonth, setLastMonth] = useState([]);
    const [NextMonth, setNextMonth] = useState([])

    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);

    useEffect(() => {
        if(calendarMonthHelper[0].isSame( moment(`${month}-${year}`,"MM-YYYY") , "month" ) ){
            setLastMonth(false);
        }
        if(calendarMonthHelper[calendarMonthHelper.length-1].isSame( moment(`${month}-${year}`,"MM-YYYY") , "month" ) ){
            setNextMonth(false);
        }

        return () => {

        }
    }, [])

    return (
        <React.Fragment>
            <div className="col-3">
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        {`Voor ${moment(`${month}-${year}`, 'MM-YYYY').subtract(1, 'month').format("MM-YYYY")}`}
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        {LastMonth!==[]&&!LastMonth?<p>N.V.T.</p>:<p>Not Implemented yet</p>}
                    </div>
                </div>
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        {`Voor ${moment(`${month}-${year}`, 'MM-YYYY').add(1, 'month').format("MM-YYYY")}`}
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                    {NextMonth!==[]&&!NextMonth?<p>N.V.T.</p>:<p>Not Implemented yet</p>}
                    </div>
                </div>
            </div>
            <div className="col-7">
                <div className='card'>
                    <div className="card-header" style={{ textAlign: 'center' }}>
                        Commentaar
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        Placeholder commentaar
                    </div>
                </div>
            </div>
            <div className="col-2" style={{ display: "flex", justifyContent: "space-around", height: "50px" }}>
                <button type="button" className="btn btn-warning" style={{ width: "100px" }} onClick={() => setShowFinalComment(false)} >annuleren</button>
                <button type="button" className="btn btn-success" style={{ width: "100px" }}  >opslaan</button>

            </div>
        </React.Fragment>
    )
}

export default SaveCalendarConfig