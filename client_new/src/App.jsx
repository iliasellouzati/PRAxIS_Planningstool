import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './screens/index/Header';
import Footer from './screens/index/Footer';
import Sidebar from './screens/index/Sidebar';
import ServerStatus from './screens/index/ServerStatus';

import EditEmployee from './screens/employee/EditEmployee';
import AllEmployees from './screens/employee/AllEmployees';
import AllContractType from './screens/contracttype/AllContractType';
import EditContractType from './screens/contracttype/EditContractType';
import AllShiftypes from './screens/shifttype/AllShifttypes';
import EditShifttype from './screens/shifttype/EditShifttype';
import AllWeeklyStructures from './screens/weeklystructure/AllWeeklyStructures';
import EditWeeklyStructure from './screens/weeklystructure/EditWeeklyStructure';
import Automatic from './screens/automatic/Automatic';
import AllCalendarStatusForYear from './screens/statuscalendar/AllCalendarStatusForYear';
import ReadOnlyCalendarScreen from './screens/calendar/ReadOnlyCalendarScreen';
import ReadAndWriteCalendarScreen from './screens/calendar/ReadAndWriteCalendarScreen';

import WebWorkersModule from './screens/WebWorkersModule';

import SuccesModal from './components/general/SuccesModal';
import DangerModal from './components/general/DangerModal';
import ProgressBar from './components/general/ProgressBar';


function App() {



  const [ShowSuccesModal, setShowSuccesModal] = useState([]);
  const [ShowDangerModal, setShowDangerModal] = useState([]);
  const [ShowProgressBar, setShowProgressBar] = useState([]);
  const incrementProgress = () => {
    setShowProgressBar([true, [++[...ShowProgressBar][1][0], [...ShowProgressBar][1][1]]]);
  }


  let WebWorkerModule = WebWorkersModule({
    "setShowSuccesModal": setShowSuccesModal,
    "setShowDangerModal": setShowDangerModal,
    "setShowProgressBar": setShowProgressBar,
    "incrementProgress": incrementProgress
  })
  useEffect(() => {
    setShowSuccesModal([false, []]);
    setShowDangerModal([false, []]);
    setShowProgressBar([false, [0, 25]]);
    return () => {
    }
  }, [])


  return (
    <BrowserRouter >

      <div id="toastsContainerTopRight" class="toasts-top-right fixed ">
        {ShowSuccesModal[0] && <SuccesModal setShowSuccesModal={setShowSuccesModal} data={ShowSuccesModal[1]} />}
        {ShowDangerModal[0] && <DangerModal setShowDangerModal={setShowDangerModal} data={ShowDangerModal[1]} />}
      </div>

      {ShowProgressBar[0] && <ProgressBar CurrentProgress={ShowProgressBar[1][0]} MaxProgress={ShowProgressBar[1][1]} setShowProgressBar={setShowProgressBar} />}

      <Header />
      <Sidebar />
      
      <Route path="/planningen/:year/historie/:month/:version" >
        <ReadOnlyCalendarScreen setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal}  />
      </Route>
      <Route path="/planningen/:year/:month/:version" >
        <ReadAndWriteCalendarScreen setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal}  />
      </Route>

    <Route path="/planningen/:year" component={AllCalendarStatusForYear} exact={true}/>

      <Route path="/automatisatie/:month" >
        <Automatic setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} INIT_StartUpMainWorkerForAutomatisation={WebWorkerModule.INIT_StartUpMainWorkerForAutomatisation} />
      </Route>


      <Route path="/weekstructuren/:id" >
        <EditWeeklyStructure setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} />
      </Route>
      <Route path="/weekstructuren" component={AllWeeklyStructures} exact={true} />



      <Route path="/werknemers/:id" >
        <EditEmployee setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} />
      </Route>
      <Route path="/werknemers" component={AllEmployees} exact={true} />


      <Route path="/shifttypes/:name" >
        <EditShifttype setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} />
      </Route>
      <Route path="/shifttypes" component={AllShiftypes} exact={true} />


      <Route path="/contracttypes/:name" >
        <EditContractType setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} />
      </Route>
      <Route path="/contracttypes" component={AllContractType} exact={true} />


      <Route path="/" component={ServerStatus} exact={true} />


      <Footer />
    </BrowserRouter >
  );
}

export default App;
