import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWeekStructuren, step3BetaInitial, step5BetaInitial } from '../../store/actions/betaActions';
import Stap3BetaAantalUren from './Stap3BetaAantalUren';


const Stap3Beta = () => {

    const dispatch = useDispatch();

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, calendar } = currentCalendar;

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes } = contracttypeList;

    const beta = useSelector((state) => state.beta);
    const { nonOperatorConfig } = beta;

    const [NietOperatoren, setNietOperatoren] = useState([])
    const [Operatoren, setOperatoren] = useState([])




    useEffect(() => {
        setNietOperatoren(employees.filter(x => (x.contracttype !== "4-5" && x.contracttype !== "operator")));
        setOperatoren(employees.filter(x => (x.contracttype === "4-5" || x.contracttype === "operator")));
        dispatch(listWeekStructuren());


        return () => {

        }
    }, [])

    return (

        <div style={{ textAlign: 'center' }}>

            <div className="row">
                <div className="col-md-12">
                    {NietOperatoren.map(employee =>
                        <div style={{ border: "1px dashed black", paddingBottom: "3px", paddingTop: "3px" }}>
                            <h6>{employee.naam} :</h6>

                            <Stap3BetaAantalUren
                                aantalUurInKwartaal={calendar.find(x => x.employeeId === employee.id).aantalUurInKwartaal}
                                datum= {datum}
                                nonEmployee={true}
                                employeeCalendar={calendar.find(x => x.employeeId === employee.id).employeeCalendar}
                                employeeId={employee.id}
                                contracttype={contracttypes.find(x => x.naam.trim() === employee.contracttype.trim())} />
                        </div>
                    )}


                </div>
            </div>
        </div>
    )
}

export default Stap3Beta

