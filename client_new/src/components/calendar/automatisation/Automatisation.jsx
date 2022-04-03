import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../general/LoadingSpinner';
import Step1 from './Step1';
import Step2 from './Step2';

const Automatisation = ({ setShowAutomatisation }) => {
  let { year, month } = useParams();

  const [StepsText, setStepsText] = useState(['bepaal operatoren', 'bepaling weken', 'bepalen logaritme'])
  const [Step, setStep] = useState(0);
  const [Loading, setLoading] = useState(true);

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { calendar } = currentCalendar;

  const [Employees, setEmployees] = useState([]);
  const [SelectedEmployees, setSelectedEmployees] = useState([]);
  const [EmployeesContracts, setEmployeesContracts] = useState([]);
  const [ContractTypes, setContractTypes] = useState([])


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
      .then(response => { setContractTypes(response.data); }).finally(setLoading(false));
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
                    1:<Step2 setStep={setStep}/>,
                    2: <span className="badge bg-success" style={{ marginLeft: "10px" }}>klaar</span>
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