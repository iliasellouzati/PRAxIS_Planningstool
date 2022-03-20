import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from '../../components/calendar/helpers';
import ReadOnlyCalendar from '../../components/calendar/ReadOnlyCalendar';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import { getCalendarShifts } from '../../redux/actions/calendarActions';
import AllControls from '../../components/control/AllControls';
import TempFile2 from '../../components/control/TempFile2';
import TempFile3 from '../../components/control/TempFile3';

const ReadAndWriteCalendarScreen = () => {

  let { year, month, version } = useParams();

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { loading } = currentCalendar;

  const dispatch = useDispatch();
  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""]);

  useEffect(() => {
    dispatch(getCalendarShifts(month, year));
  }, [])







  return (
    <div className="content-wrapper">
      {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

      {loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div >

              {/* PLANNING DIV */}
              <div className="row">
                <div className="col-12">



                  {/* PLANNING TABEL */}
                  <div className="card-body">
                    <ReadOnlyCalendar />
                  </div>

                </div>
              </div>
              <div className="row w-100 m-1">

                <div className="col-md-2" style={{ border: "1px solid black" }}>
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" id="customCheckbox1" value="option1" />
                    <label for="customCheckbox1" class="custom-control-label">Coopmanshift</label>
                  </div>
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input" type="checkbox" id="customCheckbox2" checked={true} />
                    <label for="customCheckbox2" class="custom-control-label">Standby</label>
                  </div>

                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="customCheckbox4" checked={true} />
                    <label for="customCheckbox4" class="custom-control-label">4 OPS/dag</label>
                  </div>
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger custom-control-input-outline" type="checkbox" id="customCheckbox5" checked={true} />
                    <label for="customCheckbox5" class="custom-control-label">Samengevat</label>
                  </div>
                </div>

                <div className="col-md-8" style={{ border: "1px solid black" }}>
                  <AllControls/>
                </div>
                <div className="col-md-2" style={{ border: "1px solid black" }}>
                  zdab
                </div>
              </div>


            </div>
          )
      }
    </div>)
}

export default ReadAndWriteCalendarScreen