import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import { useDispatch, useSelector } from 'react-redux';
import { getCalendarShifts } from '../../redux/actions/calendarActions';
import ReadOnlyCalendar from '../../components/calendar/ReadOnlyCalendar';
import AutomatisatieV1 from './AutomatisatieV1';

const Automatic = ({ INIT_StartUpMainWorkerForAutomatisation }) => {

  let { month } = useParams();

  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, loading, error } = currentCalendar;



  const [setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([error, ""])

  useEffect(() => {
    if (date !== month) {
      dispatch(getCalendarShifts(month));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div className="content-wrapper">
      {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

      {loading ? <LoadingSpinner />
        : error ? <Http4XXAnd5XXError error={error} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="container-fluid">

              {/* PLANNING DIV */}
              <div className="row">
                <div className="col-12">



                  {/* PLANNING TABEL */}
                  <div className="card-body">
                    <ReadOnlyCalendar />
                  </div>
                  <div className='card-footer'>
                    <AutomatisatieV1 INIT_StartUpMainWorkerForAutomatisation={INIT_StartUpMainWorkerForAutomatisation} />
                  </div>

                </div>
              </div>
            </div>
          )
      }
    </div>
  )
}

export default Automatic