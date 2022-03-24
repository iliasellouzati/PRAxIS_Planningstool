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
import axios from 'axios';

const ReadAndWriteCalendarScreen = () => {

  let { year, month } = useParams();

  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, loading, error } = currentCalendar;

  const [HighlightDay, setHighlightDay] = useState([false, []]);
  const [HighlightCustom, setHighlightCustom] = useState([false, []]);
  const [Employees, setEmployees] = useState([]);
  const [History, setHistory] = useState([]);



  const [setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([error, ""]);

  const fetchData = async () => {
    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => setEmployees(response.data))
      .catch(error => setHttp400Error([true, error]));

  }

  useEffect(() => {
    fetchData();

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

            <div className="card" style={{ height: 'max' }}>
              {/* PLANNING TABEL */}
              <div className="card-body">
                <ReadAndWriteCalendar HighlightDay={HighlightDay} HighlightCustom={HighlightCustom} />
              </div>
              <div className='card-footer'>
                <div className="row">

                  <div className="col-4">
                    <ShiftSelector />
                  </div>

                  <div className="col-6">

                    <RulesChecker setHighlightDay={setHighlightDay} setHighlightCustom={setHighlightCustom} />

                  </div>
                  <div className="col-2" style={{ display: 'inline-flex', justifyContent: 'space-around' }}>

                    <div className="btn-group-vertical" style={{height:'150px'}}>
                      <button type="button" className="btn btn-danger">UNDO</button>
                      <button type="button" className="btn btn-danger">REDO</button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown">
                          <i className='nav-icon fas fa-robot' />
                          <ul className="dropdown-menu">
                            {Employees && Employees.map(emp =>
                              <li className="dropdown-item" id={emp.id} >Reset {emp.naam.substring(0, 8)}</li>)}
                          </ul>
                        </button>
                      </div>
                      <div className="btn-group">
                        <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown">
                        </button>
                        <ul className="dropdown-menu">
                          <li className="dropdown-item">Reset all</li>
                          <li className="dropdown-item">Reset Operator</li>
                          <li className="dropdown-item">Reset Non-Operator</li>
                          <li className="dropdown-item">Reset Coopman</li>
                          <li className="dropdown-item">Reset Standby</li>
                        </ul>
                      </div>
                    </div>

                    <div className="btn-group-vertical" style={{height:'150px'}}>
                      <button type="button" className="btn btn-success">Tijdelijk opslaan</button>
                      <button type="button" className="btn btn-success">Afgewerkt</button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                        </button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">...</a></li>
                          <li><a className="dropdown-item" href="#">...</a></li>
                        </ul>
                      </div>
                    </div>

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