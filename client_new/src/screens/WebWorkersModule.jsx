import WorkerBuilder from '../logic/webworkers/worker-builder';
import MainWorker from '../logic/webworkers/mainWorker';
import CalculationWorker from '../logic/webworkers/calculationWorker';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../logic/webworkers/config';
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
      console.log(message);
      incrementProgress();
      sendReponseMainWorkerToCalculationWorkers(message.data);
    }
  };
  mainWorker.onerror = (message) => {
    console.log(message);
  }


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
    let totaal = 0;
    respons?.forEach(element => {

      if (!config.possibleWeekCombos?.some(x => x.ingevuldeOperatorShiften === element.ingevuldeOperatorShiften)) {
        config.possibleWeekCombos.push(element);
        totaal += element.combinaties.length;
      } else {
        let hulpIndex = config.possibleWeekCombos.findIndex(x => x.ingevuldeOperatorShiften === element.ingevuldeOperatorShiften);
        config.possibleWeekCombos[hulpIndex].combinaties.push(...element.combinaties);
        totaal += config.possibleWeekCombos[hulpIndex].combinaties.length;

      }
    });

    console.log('TOTAAL AAANTAL : ' + totaal);

    console.log(config.possibleWeekCombos)

    config.amountOfWorkerResponses === 3 ? handleEndOfCalculationWorkers() : config.amountOfWorkerResponses++;


  }

  //MAIN WORKERS

  const INIT_StartUpMainWorkerForAutomatisation = (message) => {

    setShowProgressBar([true, [0, message.selectedWeeks.length * 5]]);
    config = message;
    mainWorker.postMessage(["INIT", message]);
  }
  const sendReponseMainWorkerToCalculationWorkers = (respons) => {

    fireUpCalculationsWorkers();


    switch (respons[0]) {
      case "LAST_POSSIBLE_IDS_FOUND":
        mainWorker.terminate();

      // eslint-disable-next-line no-fallthrough
      case "FIRST_POSSIBLE_IDS_FOUND":
        config.incompatibelWeeks = respons[2];


      // eslint-disable-next-line no-fallthrough
      case "POSSIBLE_IDS_FOUND":


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
          "weeklyStructures": config.weeklyStructures,
          "incompatibelWeeks": config.incompatibelWeeks,
          "filters": config.filters,
          "missingShiftsWeek": config.missingShiftsWeek

        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker2 = tempFunc();
        hulpValWorker2[0].possibleWeeks = hulpValWorker2[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker2.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker2,
          "weeklyStructures": config.weeklyStructures,
          "incompatibelWeeks": config.incompatibelWeeks,
          "filters": config.filters,
          "missingShiftsWeek": config.missingShiftsWeek
        }]);
        restPerWorker !== 0 && restPerWorker--;



        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker3 = tempFunc();
        hulpValWorker3[0].possibleWeeks = hulpValWorker3[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker3.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker3,
          "weeklyStructures": config.weeklyStructures,
          "incompatibelWeeks": config.incompatibelWeeks,
          "filters": config.filters,
          "missingShiftsWeek": config.missingShiftsWeek
        }]);
        restPerWorker !== 0 && restPerWorker--;


        startIndex = endIndex;
        endIndex = restPerWorker !== 0 ? startIndex + aantalPerWorker + 1 : startIndex + aantalPerWorker;
        let hulpValWorker4 = tempFunc();
        hulpValWorker4[0].possibleWeeks = hulpValWorker4[0].possibleWeeks.slice(startIndex, endIndex);
        calculationWorker4.postMessage(["ALLE_MOGELIJKHEDEN", {
          "possibleWeekIDs": hulpValWorker4,
          "weeklyStructures": config.weeklyStructures,
          "incompatibelWeeks": config.incompatibelWeeks,
          "filters": config.filters,
          "missingShiftsWeek": config.missingShiftsWeek
        }]);
        restPerWorker !== 0 && restPerWorker--;

        break;


      default:
        break;
    }

  }
  const handleEndOfCalculationWorkers = () => {

    killAllCalculationsWorkers();
    if (config.possibleWeekCombos.length === 0) {
      setShowDangerModal([true, ["Fout!", `maand: ${date}`, `De planning voor de operatoren is mislukt wegens te weinig mogelijkheden`]])
      mainWorker.terminate();
    } else {

      config.amountOfWorkerResponses = 0;
      let randomIndex = Math.floor(Math.random() * config.possibleWeekCombos.length);
      let randomWeekComboIndex = Math.floor(Math.random() * config.possibleWeekCombos[randomIndex].combinaties.length);
      config.comboWeek = config.possibleWeekCombos[randomIndex].combinaties[randomWeekComboIndex];
      console.log(config);
      config.comboWeek.forEach(weekCombo => {
        let week = config.weeklyStructures.find(x => x.id === weekCombo.weekId);
        dispatchWeek(config.selectedWeeks[0], week, weekCombo.empId);
      })

      // setTimeout(function () {
      //   config.comboWeek = [];
      //   config.possibleWeekCombos = [];
      //   let newPreviousWeeks = [];

      //   calendar.filter(x => config.employees.some(empl => empl.id === x.employeeId)).forEach(emplCal => {
      //     let hulpcal = emplCal.calendar.slice((parseInt(config.WeekNumber) - 1) * 7, (parseInt(config.WeekNumber) * 7));
      //     hulpcal = hulpcal.map(x => x.shift);
      //     newPreviousWeeks.push({
      //       "employeeId": emplCal.employeeId,
      //       "week": hulpcal
      //     })
      //   })

      //   config.previousWeeks = newPreviousWeeks;

      //   config.WeekNumber = `${parseInt(config.WeekNumber) + 1}`;
      //   if (parseInt(config.WeekNumber) < config.numberOfWeeks) {
      //     mainWorker.postMessage(["CONTINU", config]);
      //   } else if (parseInt(config.WeekNumber) === config.numberOfWeeks) {
      //     mainWorker.postMessage(["LAST_ONE", config]);
      //   } else {
      //     setShowSuccesModal([true, ["Klaar!", `maand: ${date}`, `De planningvoor de operatoren werd aangemaakt`]])
      //   }
      // }, 250);

    }



  }



  const dispatchWeek = (datum, week, employeeId) => {
console.log(`Werknemer : ${employeeId}`);
    console.log(week);

    week.maandag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': "DD-MM-YYYY",
      'shift': week.maandag, 'startmoment': null, 'endmoment': null
    }));
    week.dinsdag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(1,'day').format("DD-MM-YYYY"),
      'shift': week.dinsdag, 'startmoment': null, 'endmoment': null
    }));
    week.woensdag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(2,'day').format("DD-MM-YYYY"),
      'shift': week.woensdag, 'startmoment': null, 'endmoment': null
    }));
    week.donderdag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(3,'day').format("DD-MM-YYYY"),
      'shift': week.donderdag, 'startmoment': null, 'endmoment': null
    }));
    week.vrijdag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(4,'day').format("DD-MM-YYYY"),
      'shift': week.vrijdag, 'startmoment': null, 'endmoment': null
    }));

    week.zaterdag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(5,'day').format("DD-MM-YYYY"),
      'shift': week.zaterdag, 'startmoment': null, 'endmoment': null
    }));

    week.zondag !== '' && dispatch(addShift({
      'id': employeeId,
      'day': moment(datum, "DD-MM-YYYY").add(6,'day').format("DD-MM-YYYY"),
      'shift': week.zondag, 'startmoment': null, 'endmoment': null
    }));

  }

  return { INIT_StartUpMainWorkerForAutomatisation }
}

export default WebWorkersModule