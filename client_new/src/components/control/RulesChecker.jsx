import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getCalendarMoments_ArrayWithMoments } from '../calendar/helpers';
import { DagNaNacht, Max4OperatorShifts, StandbyControle } from './Prio1';
import { CoopmanShiftControle ,OverurenWeekControle} from './Prio2';
import GeneralRulesLine from './GeneralRulesLine';
import IndividualRulesLine from './IndividualRulesLine';


const RulesChecker = ({ setHighlightDay, setHighlightCustom }) => {

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, calendar } = currentCalendar;

  const [Shifttypes, setShifttypes] = useState();

  const [ResetView, setResetView] = useState(0);
  const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(date);

  const dataObject = { 'calendar': calendar, 'calendarMonthHelper': calendarMonthHelper, 'shifttypes': Shifttypes };


  //--------------- PRIO 1 ----------------
  const [Prio1, setPrio1] = useState({
    'STANDBY': [],
    '>4FOLLOWINGSHIFTS': [],
    'DayAfterNight': []
  });
  const checkRegularPrio1 = () => {
    setPrio1({
      ...Prio1,
      'STANDBY': StandbyControle(dataObject),
      '>4FOLLOWINGSHIFTS': Max4OperatorShifts(dataObject),
      'DayAfterNight': DagNaNacht(dataObject)
    })
  }
  const checkFinalPrio1 = () => {
    setPrio1({
      ...Prio1
    })
  }

  //--------------- PRIO 2 ----------------
  const [Prio2, setPrio2] = useState({
    'COOPMAN': [],
    'OverurenWeek':[]
  });
  const checkRegularPrio2 = () => {
    setPrio2({ ...Prio2, 'COOPMAN': CoopmanShiftControle(dataObject), 'OverurenWeek': OverurenWeekControle(dataObject) })
  }
  const checkFinalPrio2 = () => {

  }

  //--------------- PRIO 3 ----------------
  const [Prio3, setPrio3] = useState([]);
  const checkRegularPrio3 = () => {
  }
  const checkFinalPrio3 = () => {

  }

  const checkFinal = () => {
    checkFinalPrio1();
    checkFinalPrio2();
    checkFinalPrio3();
  }



  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => {
        setShifttypes(response.data);
      })
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData])


  useEffect(() => {
    if (Shifttypes) {
      checkRegularPrio1();
      checkRegularPrio2();
      checkRegularPrio3();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar, Shifttypes])

  return (
    <div className="card collapsed-card">
      <div className="card-header border-0">
        <h3 className="card-title">Controle regels</h3>
        <div className="card-tools">
          <div class="card-tools">
            <button type="button" class="btn  btn-sm" title="Eindcontrole" onClick={() => checkFinal()}>
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn  btn-sm" title="refresh" onClick={() => setResetView(() => ResetView + 1)}>
              <i class="fas fa-redo-alt"></i>
            </button>
            <button type="button" class="btn  btn-sm" data-card-widget="collapse" title="Collapse">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center  border-bottom mb-3">
          <p className="text-danger text-xl">
            <i className="fas fa-ban"></i>
          </p>
          <p className="d-flex flex-column text-right">
            <GeneralRulesLine setHighlightDay={setHighlightDay}  ResetView={ResetView} name={'Standby'} data={Prio1['STANDBY']} />
            <IndividualRulesLine setHighlightCustom={setHighlightCustom} ResetView={ResetView} name={'>4 opeenvol. op. shiften'} data={Prio1['>4FOLLOWINGSHIFTS']} />
            <IndividualRulesLine setHighlightCustom={setHighlightCustom} ResetView={ResetView} name={'Dag na een nacht'} data={Prio1['DayAfterNight']} />

          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
          <p className="text-warning text-xl">
            <i className="fas fa-exclamation-triangle"></i>
          </p>
          <p className="d-flex flex-column text-right">
            <GeneralRulesLine setHighlightDay={setHighlightDay} ResetView={ResetView} name={'Coopman'} data={Prio2['COOPMAN']} />
            <IndividualRulesLine setHighlightCustom={setHighlightCustom} ResetView={ResetView} name={'Overuren Week'} data={Prio2['OverurenWeek']} />
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-0">

          <p className=" text-xl">
            <i className="fas fa-question"></i>
          </p>

          <p className="d-flex flex-column text-right">

          </p>
        </div>
      </div>
    </div>
  )
}

export default RulesChecker