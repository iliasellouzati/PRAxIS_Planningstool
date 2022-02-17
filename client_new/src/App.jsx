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
import Automatic from './screens/automatic/Automatic';
import WorkerBuilder from './logic/webworkers/worker-builder';
import MainWorker from './logic/webworkers/mainWorker';
import CalculationWorker from './logic/webworkers/calculationWorker';




function App() {


  let mainWorker = new WorkerBuilder(MainWorker);
  let calculationWorker1 = new WorkerBuilder(CalculationWorker);
  let calculationWorker2 = new WorkerBuilder(CalculationWorker);
  let calculationWorker3 = new WorkerBuilder(CalculationWorker);
  let calculationWorker4 = new WorkerBuilder(CalculationWorker);
  let calculationWorker5 = new WorkerBuilder(CalculationWorker);

  let config = {
    "weeklyStructures": [],
    "employees": [],
    "config": [],
    "previousWeeks": [],
    "missingShiftsWeek": [],
    "WeekNumber": "",
    "possibleWeekCombos": [],
    "possibleWeekIDs":[],
    "amountOfWorkerResponses": 0,
    "comboWeek1": [],
    "comboWeek2": []

  }
  const tempFunc = () =>{
    return [...config.possibleWeekIDs.slice()];
  }

  const [ProgressAutomatisation, setProgressAutomatisation] = useState(0);

  mainWorker.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from MAINWORKER");
      console.log(message.data);
      handleMainWorkerResponse(message.data);
    }
  };

  calculationWorker1.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from CALCULATIONWORKER");
      console.log(message.data);
      handleCalculationWorkerResponse(message.data);
    }
  };

  calculationWorker2.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from CALCULATIONWORKER");
      console.log(message.data);
      handleCalculationWorkerResponse(message.data);
    }
  };

  calculationWorker3.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from CALCULATIONWORKER");
      console.log(message.data);
      handleCalculationWorkerResponse(message.data);
    }
  };

  calculationWorker4.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from CALCULATIONWORKER");
      console.log(message.data);
      handleCalculationWorkerResponse(message.data);
    }
  };

  calculationWorker5.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from CALCULATIONWORKER");
      console.log(message.data);
      handleCalculationWorkerResponse(message.data);
    }
  };



  const handeEndCalculationOfWorkers = () => {
    config.amountOfWorkerResponses = 0;

  }

  const handleCalculationWorkerResponse = (respons) => {
    respons.forEach(element => {

      if (!config.possibleWeekCombos.some(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften)) {

        config.possibleWeekCombos.push(element)
      } else {

        let hulpIndex = config.possibleWeekCombos.findIndex(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften);

        config.possibleWeekCombos[hulpIndex].combinaties.push(...element.combinaties);
      }
    });

    config.amountOfWorkerResponses === 4 ? handeEndCalculationOfWorkers() : config.amountOfWorkerResponses++;


  }


  const handleMainWorkerResponse = (respons) => {

    switch (respons[0]) {
      case "WEEK_1_POSSIBLE_IDS_FOUND":
        config.possibleWeekIDs = respons[1];


        let totaalAantal = config.possibleWeekIDs[0].possibleWeeks.length;
        let aantalPerWorker = Math.floor(totaalAantal / 5);
        let restPerWorker = (totaalAantal % 5);
        let startIndex = 0;
        let endIndex = 0;



        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker1 = Array.from(config.possibleWeekIDs);
        hulpValWorker1[0].possibleWeeks = hulpValWorker1[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker1.postMessage(["ALLE_MOGELIJKHEDEN", {
            "possibleWeekIDs": hulpValWorker1,
            "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber)-1],
            "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker2 = [...config.possibleWeekIDs.slice()]
        hulpValWorker2[0].possibleWeeks =hulpValWorker2[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker2.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker2,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber)-1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker3 =[...config.possibleWeekIDs.slice()]
        hulpValWorker3[0].possibleWeeks = hulpValWorker3[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker3.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker3,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber)-1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker4 = [...config.possibleWeekIDs.slice()]
        hulpValWorker4[0].possibleWeeks = hulpValWorker4[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker4.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker4,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber)-1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker5 = [...config.possibleWeekIDs.slice()]
        hulpValWorker5[0].possibleWeeks = hulpValWorker5[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker5.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker5,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber)-1],
          "weeklyStructures": config.weeklyStructures
        }]);

        break;

      default:
        break;
    }


  }

  const postToMainWorker = (message) => {
    config.weeklyStructures = message[1]["weeklyStructures"];
    config.employees = message[1]["employees"];
    config.config = message[1]["config"];
    config.previousWeeks = message[1]["previousWeeks"];
    config.missingShiftsWeek = message[1]["missingShiftsWeek"];
    config.WeekNumber = message[1]["WeekNumber"];

    mainWorker.postMessage(message);
  }


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


      <Route path="/automatisatie/:month" >
        <Automatic setShowSuccesModal={setShowSuccesModal} setShowDangerModal={setShowDangerModal} postToMainWorker={postToMainWorker} />
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
