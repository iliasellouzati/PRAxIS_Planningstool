import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import { getCalendarShifts, setSavedCalendar } from '../../redux/actions/calendarActions';
import ReadOnlyCalendar from '../../components/calendar/ReadOnlyCalendar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { mapSavedShiftsFromDbToHistory } from '../../mappers/calendar/DatabaseToReduxMapper';
import ReadOnlySavedCalendar from '../../components/calendar/ReadOnlySavedCalendar';


const ReadOnlyCalendarScreen = () => {

  let { year, month, version } = useParams();



  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date } = currentCalendar;
  const [Loading, setLoading] = useState(true);

  const [Shifttypes, setShifttypes] = useState([]);
  const [Employees, setEmployees] = useState([]);

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""]);

  const fetchData = async () => {
    await axios.get(`http://localhost:3001/api/calendar/global/year/${year}/calendarmonth/${month}/version/${version}`)
      .then(response => setUpData(response.data))
      .catch(error => setHttp400Error([true, ['foutmelding', error]]))
      .finally(() => setLoading(false));
  };

  const setUpData = savedShifts => {

    let savedCalendar = mapSavedShiftsFromDbToHistory(savedShifts);
    setEmployees(savedCalendar['employees']);
    setShifttypes(savedCalendar['shifttypes']);

    dispatch(setSavedCalendar(savedCalendar['calendar'], `${month}-${year}_V${version}`))
  }


  useEffect(() => {

    if (date !== `${month}-${year}_V${version}`) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [])



  return (
    <div className="content-wrapper">
      {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

      {Loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (



            < div className="card">
              <div className="card-body">
                <ReadOnlySavedCalendar Employees={Employees} Shifttypes={Shifttypes} />
              </div>

            </div>
          )
      }
    </div >
  )
}

export default ReadOnlyCalendarScreen