import React, { useState } from 'react';
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

import SuccesModal from './components/general/SuccesModal';
import DangerModal from './components/general/DangerModal';



function App() {

  const [ShowSuccesModal, setShowSuccesModal] = useState([false, []]);
  const [ShowDangerModal, setShowDangerModal] = useState([false, []]);
  return (
    <BrowserRouter >

      <div id="toastsContainerTopRight" class="toasts-top-right fixed">
        {ShowSuccesModal[0] && <SuccesModal setShowSuccesModal={setShowSuccesModal} data={ShowSuccesModal[1]} />}
        {ShowDangerModal[0] && <DangerModal setShowDangerModal={setShowDangerModal} data={ShowDangerModal[1]} />}
      </div>


      <Header />
      <Sidebar />



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

      <Route path="/" component={ServerStatus} exact={true} />

      <Route path="/contracttypes/:name" >
        <EditContractType setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} />
      </Route>
      <Route path="/contracttypes" component={AllContractType} exact={true} />



      <Footer />
    </BrowserRouter >
  );
}

export default App;