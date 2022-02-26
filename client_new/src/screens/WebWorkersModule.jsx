import WorkerBuilder from '../logic/webworkers/worker-builder';
import MainWorker from '../logic/webworkers/mainWorker';
import CalculationWorker from '../logic/webworkers/calculationWorker';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../logic/webworkers/config';
import { useEffect } from 'react';
import { addShift } from '../redux/actions/calendarActions';
import moment from 'moment';

const WebWorkersModule = ({ setShowSuccesModal, setShowDangerModal, setShowProgressBar, incrementProgress }) => {

  //globar vars
  const dispatch = useDispatch();
  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { date, calendar } = currentCalendar;

  //config
  let config = Config;
  const tempFunc = () => JSON.parse(JSON.stringify(config.possibleWeekIDs));


  //Web Workers
  let mainWorker = new WorkerBuilder(MainWorker);
  let calculationWorker1;
  let calculationWorker2;
  let calculationWorker3;
  let calculationWorker4;

  mainWorker.onmessage = (message) => {
    if (message) {
      console.log("------- Message in MAIN THREAD from MAINWORKER");
      console.log(message.data[1]);
      console.log(config);
      incrementProgress();
      sendReponseMainWorkerToCalculationWorkers(message.data);
    }
  };


  //functions


  //CALC WORKERS

  const fireUpCalculationsWorkers = () => {
    calculationWorker1 = new WorkerBuilder(CalculationWorker);
    calculationWorker2 = new WorkerBuilder(CalculationWorker);
    calculationWorker3 = new WorkerBuilder(CalculationWorker);
    calculationWorker4 = new WorkerBuilder(CalculationWorker);

    calculationWorker1.onmessage = (message) => {
      if (message) {
        handleCalculationWorkerResponse(message.data);
      }
    };
    calculationWorker2.onmessage = (message) => {
      if (message) {
        handleCalculationWorkerResponse(message.data);
      }
    };
    calculationWorker3.onmessage = (message) => {
      if (message) {
        handleCalculationWorkerResponse(message.data);
      }
    };
    calculationWorker4.onmessage = (message) => {
      if (message) {
        handleCalculationWorkerResponse(message.data);
      }
    };
  }
  const killAllCalculationsWorkers = () => {
    calculationWorker1.terminate();
    calculationWorker2.terminate();
    calculationWorker3.terminate();
    calculationWorker4.terminate();
  }
  const handleCalculationWorkerResponse = (respons) => {
    incrementProgress();
    respons.forEach(element => {

      if (!config.possibleWeekCombos.some(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften)) {
        config.possibleWeekCombos.push(element)
      } else {
        let hulpIndex = config.possibleWeekCombos.findIndex(x => x.nietIngevuldeShiften === element.nietIngevuldeShiften);
        config.possibleWeekCombos[hulpIndex].combinaties.push(...element.combinaties);
      }
    });

    config.amountOfWorkerResponses === 3 ? handleEndOfCalculationWorkers() : config.amountOfWorkerResponses++;


  }

  //MAIN WORKERS

  const INIT_StartUpMainWorkerForAutomatisation = (message) => {
    config.weeklyStructures = message[1]["weeklyStructures"];
    config.employees = message[1]["employees"];
    config.config = message[1]["config"];
    config.previousWeeks = message[1]["previousWeeks"];
    config.missingShiftsWeek = message[1]["missingShiftsWeek"];
    config.WeekNumber = message[1]["WeekNumber"];
    config.numberOfWeeks = message[1]["numberOfWeeks"];
    setShowProgressBar([true, [0, (parseInt(config.numberOfWeeks) * 5)]]);
    mainWorker.postMessage([message[0], config]);
  }
  const sendReponseMainWorkerToCalculationWorkers = (respons) => {

    fireUpCalculationsWorkers();

    switch (respons[0]) {
      case "POSSIBLE_IDS_FOUND":
      case "LAST_POSSIBLE_IDS_FOUND":


        config.possibleWeekIDs = respons[1];

        let totaalAantal = config.possibleWeekIDs[0].possibleWeeks.length;
        let aantalPerWorker = Math.floor(totaalAantal / 4);
        let restPerWorker = (totaalAantal % 4);
        let startIndex = 0;
        let endIndex = 0;



        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker1 = tempFunc();
        hulpValWorker1[0].possibleWeeks = hulpValWorker1[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker1.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker1,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber) - 1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker2 = tempFunc();
        hulpValWorker2[0].possibleWeeks = hulpValWorker2[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker2.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker2,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber) - 1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker3 = tempFunc();
        hulpValWorker3[0].possibleWeeks = hulpValWorker3[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker3.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker3,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber) - 1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker4 = tempFunc();
        hulpValWorker4[0].possibleWeeks = hulpValWorker4[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker4.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker4,
          "missingShiftsWeek": config.missingShiftsWeek[parseInt(config.WeekNumber) - 1],
          "weeklyStructures": config.weeklyStructures
        }]);
        restPerWorker !== 0 && restPerWorker--;

        break;



      case "FINISHED":
        mainWorker.terminate();

        break;

      default:
        break;
    }

  }
  const handleEndOfCalculationWorkers = () => {

    killAllCalculationsWorkers();

    config.amountOfWorkerResponses = 0;

    let randomIndex = Math.floor(Math.random() * config.possibleWeekCombos.length);

    let randomWeekComboIndex = Math.floor(Math.random() * config.possibleWeekCombos[randomIndex].combinaties.length);

    config.comboWeek = config.possibleWeekCombos[randomIndex].combinaties[randomWeekComboIndex];

    config.comboWeek.forEach((weekId, index) => {
      let week = config.weeklyStructures.find(x => x.id === weekId);
      dispatchWeek(config.WeekNumber, week, config.employees[index], date);
    })

    setTimeout(function () {
      config.comboWeek = [];
      config.possibleWeekCombos = [];
      let newPreviousWeeks = [];

      calendar.filter(x => config.employees.some(empl => empl.id === x.employeeId)).forEach(emplCal => {
        let hulpcal = emplCal.calendar.slice((parseInt(config.WeekNumber) - 1) * 7, (parseInt(config.WeekNumber) * 7));
        hulpcal = hulpcal.map(x => x.shift);
        newPreviousWeeks.push({
          "employeeId": emplCal.employeeId,
          "week": hulpcal
        })
      })

      config.previousWeeks = newPreviousWeeks;

      config.WeekNumber = `${parseInt(config.WeekNumber) + 1}`;
      if (parseInt(config.WeekNumber) === config.numberOfWeeks) {
        mainWorker.postMessage(["LAST_ONE", config]);

      } else {
        mainWorker.postMessage(["CONTINU", config]);
      }
    }, 250);

  }
  const dispatchWeek = (weekNumber, week, employee, date) => {

    week.maandag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").format("DD-MM-YYYY"),
      'shift': week.maandag
    }));
    week.dinsdag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(1, "day").format("DD-MM-YYYY"),
      'shift': week.dinsdag
    }));
    week.woensdag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(2, "day").format("DD-MM-YYYY"),
      'shift': week.woensdag
    }));
    week.donderdag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(3, "day").format("DD-MM-YYYY"),
      'shift': week.donderdag
    }));
    week.vrijdag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(4, "day").format("DD-MM-YYYY"),
      'shift': week.vrijdag
    }));

    week.zaterdag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(5, "day").format("DD-MM-YYYY"),
      'shift': week.zaterdag
    }));

    week.zondag !== '' && dispatch(addShift({
      'id': employee.id,
      'day': moment(date, "MM-YYYY").startOf("month").startOf('isoWeek').add(parseInt(weekNumber) - 1, "week").add(6, "day").format("DD-MM-YYYY"),
      'shift': week.zondag
    }));

  }




  return { INIT_StartUpMainWorkerForAutomatisation }
}

export default WebWorkersModule