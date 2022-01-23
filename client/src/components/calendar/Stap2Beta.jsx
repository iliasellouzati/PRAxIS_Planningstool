import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import AantalUrenInCalendarVoorWerknemer from './control_components/AantalUrenInCalendarVoorWerknemer';
import AantalUreninKwartaalVoorWerknemer from './control_components/AantalUreninKwartaalVoorWerknemer';
import CoopmanShiftControle from './control_components/CoopmanShiftControle';
import { step3BetaInitial, step5BetaInitial } from '../../store/actions/betaActions';

const Stap2Beta = () => {

    const dispatch = useDispatch();
    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, calendar } = currentCalendar;

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes } = contracttypeList;


    const [NietOperatoren, setNietOperatoren] = useState([])


    useEffect(() => {

        setNietOperatoren(employees.filter(x => (x.contracttype !== "4-5" && x.contracttype !== "operator")));
        dispatch(step3BetaInitial(employees.filter(x => (x.contracttype !== "4-5" && x.contracttype !== "operator"))));
        dispatch(step5BetaInitial(employees.filter(x => (x.contracttype === "4-5" || x.contracttype === "operator"))));

        return () => {

        }
    }, [calendar])

    return (
        <div style={{ textAlign: 'center' }}>

            <div className="row">
                <div className="col-md-8">

                    {NietOperatoren.map(employee =>
                        <div style={{ border: "1px dashed black", paddingBottom: "3px", paddingTop: "3px" }}>
                            <h6>{employee.naam} :</h6>

                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    Maanduren:
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <AantalUrenInCalendarVoorWerknemer employeeCalendar={calendar.find(x => x.employeeId === employee.id).employeeCalendar} />
                                        <div>
                                            / {Math.ceil(contracttypes.find(x => x.naam.trim() === employee.contracttype.trim()).maandelijke_contract_uren / 3)}
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    Kwartaal uren:
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <AantalUreninKwartaalVoorWerknemer aantalUurInKwartaal={calendar.find(x => x.employeeId === employee.id).aantalUurInKwartaal} employeeCalendar={calendar.find(x => x.employeeId === employee.id).employeeCalendar} />
                                        <div>
                                            / {Math.ceil(contracttypes.find(x => x.naam.trim() === employee.contracttype.trim()).maandelijke_contract_uren)}
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    ????:
                                </div>

                            </div>
                        </div>
                    )}

                </div>

                <div className="col-md-4">
                    <div style={{ border: "1px dashed black", paddingBottom: "3px", paddingTop: "3px" }}>
                        <CoopmanShiftControle />

                    </div>

                </div>
            </div>
        </div>
    )
}


export default Stap2Beta
