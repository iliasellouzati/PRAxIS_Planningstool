import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import { getCalendarShifts } from '../../redux/actions/calendarActions';
import ReadOnlyCalendar from '../../components/calendar/ReadOnlyCalendar';
import { useDispatch } from 'react-redux';


const ReadOnlyCalendarScreen = () => {

  let { year, month, version } = useParams();
  const [Loading, setLoading] = useState(true);


  const dispatch = useDispatch();
  const [Http4XXAnd5XX,setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""]);

  useEffect(() => {
 
  }, [])


  return (
    <div className="content-wrapper">
      {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

      {Loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="container-fluid">

              {/* PLANNING DIV */}
              <div className="row">
                <div className="col-12">



                  {/* PLANNING TABEL */}
                  <div className="card-body">
                    <ReadOnlyCalendar />
                  </div>

                </div>
              </div>
            </div>
          )
      }
    </div>
  )
}

export default ReadOnlyCalendarScreen