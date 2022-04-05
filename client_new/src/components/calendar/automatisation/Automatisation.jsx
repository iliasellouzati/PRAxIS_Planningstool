import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../general/LoadingSpinner';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import configInterface from '../../../logic/webworkers/config';
import Step6 from './Step6';

const Automatisation = ({ setShowAutomatisation, INIT_StartUpMainWorkerForAutomatisation }) => {
  let { year, month } = useParams();

  const [StepsText, setStepsText] = useState(['bepaal operatoren', 'bepaling weken', 'bepalen filters', 'bepalen logaritme', 'overzicht', 'resultaat'])
  const [Step, setStep] = useState(0);
  const [Loading, setLoading] = useState(true);

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { calendar } = currentCalendar;

  const [Employees, setEmployees] = useState([]);
  const [SelectedEmployees, setSelectedEmployees] = useState([]);
  const [EmployeesContracts, setEmployeesContracts] = useState([]);
  const [SelectedWeeks, setSelectedWeeks] = useState([]);
  const [MissingShifts, setMissingShifts] = useState([]);
  const [ContractTypes, setContractTypes] = useState([]);
  const [WeeklyStructures, setWeeklyStructures] = useState([]);
  
  const [Logaritme, setLogaritme] = useState({
    "name": "WEEKS_BETWEEN_DAY_AND_NIGHT",
    "data": {
      'minWeeks': 1,
      'maxWeeks': 5
    }
  });
  const [Config, setConfig] = useState([]);


  const [SelectedFilters, setSelectedFilters] = useState([]);
  const [SeparateEmployees, setSeparateEmployees] = useState([])


  const createConfigFile = () => {

    let config = configInterface;
    config.weeklyStructures = WeeklyStructures;
    config.employees = SelectedEmployees;
    config.logaritme = Logaritme;
    config.previousWeeks = null;
    config.missingShiftsWeek = MissingShifts;
    config.WeekNumber = null;
    config.possibleWeekCombos = null;
    config.possibleWeekIDs = null;
    config.amountOfWorkerResponses = null;
    config.comboWeek = null;
    config.weeksToCheck = SelectedWeeks;
    config.filters = SelectedFilters;
    config.separateEmployees = SeparateEmployees;

    setConfig(config);
    console.log(config);

  }



  const fetchData = async () => {
    let contracts;
    await axios.get(`http://127.0.0.1:3001/api/employee/calendaremployees/${year}/${month}`).then(response => {
      contracts = response.data.filter(x => ["YES", "PARTIAL"].includes(x.full_month_contract));
      setEmployeesContracts(contracts);

    });

    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => {
        setEmployees(response.data);
        setSelectedEmployees(response.data.filter(x => [1, 5].includes(x.contracttype_id) && contracts.find(y => y.employeeId === x.id)?.full_month_contract === "YES").map(x => x.id));
      });

    await axios.get('http://127.0.0.1:3001/api/contracttype')
      .then(response => { setContractTypes(response.data); });

    await axios.get('http://127.0.0.1:3001/api/weeklystructure')
      .then(response => { setWeeklyStructures(response.data); });

    await axios.get('http://127.0.0.1:3001/api/contracttype')
      .then(response => setContractTypes(response.data)).finally(setLoading(false));

  }

  useEffect(() => {
    fetchData();

    return () => {

    }
  }, [])




  return (

    <React.Fragment>
      {Loading ?
        <LoadingSpinner /> :
        <React.Fragment>
          <div className="col-11">
            <div className="card">
              <div className="card-header">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ padding: '0px', margin: '0px' }}>  {`Automatisch operatorshiften toekennen voor maand ${month}-${year}`}</p>
                  <div>  {StepsText[Step]}</div>
                </div>

              </div>
              <div className="card-body">


                {
                  {

                    0: <Step1
                      EmployeesContracts={EmployeesContracts}
                      SelectedEmployees={SelectedEmployees}
                      Employees={Employees}
                      setSelectedEmployees={setSelectedEmployees}
                      setStep={setStep} />,
                    1: <Step2
                      setStep={setStep}
                      SelectedWeeks={SelectedWeeks}
                      setSelectedWeeks={setSelectedWeeks}
                      setMissingShifts={setMissingShifts}
                      MissingShifts={MissingShifts} />,
                    2: <Step3
                      setStep={setStep}
                      setSelectedFilters={setSelectedFilters}
                      SelectedFilters={SelectedFilters}
                      contracts={EmployeesContracts}
                      employees={Employees}
                      setSeparateEmployees={setSeparateEmployees}
                      SeparateEmployees={SeparateEmployees} />,
                    3: <Step4
                      setStep={setStep}
                      Logaritme={Logaritme}
                      setLogaritme={setLogaritme} />,
                    4: <Step5 setStep={setStep} createConfigFile={createConfigFile} Config={Config} />,
                    5: <Step6 Config={Config} INIT_StartUpMainWorkerForAutomatisation={INIT_StartUpMainWorkerForAutomatisation}  />
                  }[Step]
                }





              </div>
            </div>

          </div>

          <div className="col-1">
            <button type="button" className="btn btn-warning" style={{ width: "100px" }} onClick={() => setShowAutomatisation(false)} >Keer terug</button>

          </div>
        </React.Fragment>
      }

    </React.Fragment>

  )
}

export default Automatisation