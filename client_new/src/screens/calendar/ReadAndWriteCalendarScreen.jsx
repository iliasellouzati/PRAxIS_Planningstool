import React, { useEffect, useState } from 'react';
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
import { mapReduxCalendarToDb } from '../../mappers/calendar/ReduxToDatabaseMapper';
import moment from 'moment';
import SaveCalendarConfig from '../../components/calendar/SaveCalendarConfig';
import Automatisation from '../../components/calendar/automatisation/Automatisation';

const ReadAndWriteCalendarScreen = ({ setShowDangerModal, setShowSuccesModal, INIT_StartUpMainWorkerForAutomatisation }) => {

  let { year, month, version } = useParams();

  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, calendar, loading, error } = currentCalendar;
  const [setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([error, ""]);
  const [HighlightDay, setHighlightDay] = useState([false, []]);
  const [HighlightCustom, setHighlightCustom] = useState([false, []]);
  const [Employees, setEmployees] = useState([]);
  const [Shifttypes, setShifttypes] = useState([]);
  const [ShowFinalComment, setShowFinalComment] = useState(false);
  const [ShowAutomatisation, setShowAutomatisation] = useState(false);

  const saveShiftsToDb = async () => {
    let calendarForDb = mapReduxCalendarToDb(calendar);
    await storeTempData(calendarForDb);
  }

  const storeTempData = async (calendarForDb) => {
    let progres;
    await axios.get(`http://localhost:3001/api/statuscalendar/${year}/${month}/${version}`)
      .then(response => { progres = response.data[0].progress; })
      .catch(error => setHttp400Error([true, ['Foutmelding', error.response.data]]));
    if (progres === 0) {
      await axios.post(`http://localhost:3001/api/statuscalendar/${year}/${month}/${version}`, { "timestamp": moment().format("DD/MM/YYYY HH:MM") })
        .catch(error => setHttp400Error([true, ['Foutmelding', error.response.data]]));
    }
    await axios.post(`http://127.0.0.1:3001/api/calendar/global/year/${year}/calendarmonth/${month}`, calendarForDb)
      .then(response => setShowSuccesModal([true, ['Shiften opgeslagen!', `${month}-${year}`, response.data]]))
      .catch(error => setHttp400Error([true, ['Foutmelding', error.response.data]]));
  }


  const fetchData = async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => setShifttypes(response.data))
      .catch(error => setHttp400Error([true, ['foutmelding', error]]));

    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => setEmployees(response.data))
      .catch(error => setHttp400Error([true, ['Foutmelding', ['Foutmelding', error]]]));
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
                  {ShowFinalComment ?
                    <SaveCalendarConfig setShowSuccesModal={setShowSuccesModal} employees={Employees} shifttypes={Shifttypes} setShowFinalComment={setShowFinalComment} />

                    : ShowAutomatisation ?
                      <Automatisation INIT_StartUpMainWorkerForAutomatisation={INIT_StartUpMainWorkerForAutomatisation} setShowAutomatisation={setShowAutomatisation} />
                      :

                      <React.Fragment>
                        <div className="col-4">
                          <ShiftSelector />
                        </div>
                        <div className="col-6">

                          <RulesChecker setHighlightDay={setHighlightDay} setHighlightCustom={setHighlightCustom} />

                        </div>
                        <div className="col-2" style={{ display: "flex", justifyContent: "space-around", height: "150px" }}>

                          <div className="btn-group-vertical" style={{ width: "100px" }}>
                            <button type="button" className="btn btn-danger">UNDO</button>
                            {false && <button type="button" className="btn btn-danger">REDO</button>}
                            <div className="btn-group">
                              <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown">
                                <i className='nav-icon fas fa-robot' />
                                <ul className="dropdown-menu">
                                  {Employees && Employees.map(emp =>
                                    <li className="dropdown-item" id={emp.id} >Reset {emp.voornaam}</li>)}
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

                          <div className="btn-group-vertical" style={{ width: "100px" }}>
                            <button type="button" className="btn btn-success" onClick={() => saveShiftsToDb()}>Tijdelijk opslaan</button>
                            <button type="button" className="btn btn-success" onClick={() => setShowFinalComment(true)} >Afwerken</button>
                            <div className="btn-group">
                              <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                              </button>
                              <ul className="dropdown-menu">
                                <li className='dropdown-item' onClick={() => { setShowAutomatisation(true); }}>Automatiseer</li>
                                <li className='dropdown-item'>...</li>

                              </ul>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                  }
                </div>
              </div>
            </div>

          )
      }



    </div>
  )
}

export default ReadAndWriteCalendarScreen