import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReadAndWriteCalendar from '../../components/calendar/ReadAndWriteCalendar';
import ShiftSelector from '../../components/calendar/ShiftSelector';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import { getCalendarShifts } from '../../redux/actions/calendarActions';
import RulesChecker from '../../components/control/RulesChecker';

const ReadAndWriteCalendarScreen = () => {

  let { year, month } = useParams();

  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, loading, error } = currentCalendar;



  const [setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([error, ""])

  useEffect(() => {
    if (date !== `${month}-${year}`) {
      dispatch(getCalendarShifts(`${month}-${year}`));
    }
  }, [])


  return (
    <div className='content-wrapper' >
      {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}


      {loading ? <LoadingSpinner />
        : error ? <Http4XXAnd5XXError error={error} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (

            <div className="card">
              {/* PLANNING TABEL */}
              <div className="card-body">
                <ReadAndWriteCalendar />
              </div>
              <div className='card-footer'>
                <div className="row">

                  <div className="col-4">
                    <ShiftSelector />
                  </div>

                  <div className="col-4">
                    
                     <RulesChecker/>

                  </div>
                  <div className="col-2">

                  </div>

                </div>
              </div>
            </div>

          )
      }



    </div>
  )
}

export default ReadAndWriteCalendarScreen