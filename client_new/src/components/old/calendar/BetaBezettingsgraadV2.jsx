import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as MOMENT_OPERATIONS from '../../moment_operations';
import moment from "moment";
import { listWeekStructuren, step3BetaInitial, step5BetaInitial } from '../../store/actions/betaActions';



const BetaBezettingsgraadV2 = () => {

    const beta = useSelector((state) => state.beta);
    const { nonOperatorConfig, OperatorConfig } = beta;

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar, datum } = currentCalendar;

    const [AantalInTePlannenOperatorShiften, setAantalInTePlannenOperatorShiften] = useState(0);
    const [AantalShiftsVoorVolgendeMaand, setAantalShiftsVoorVolgendeMaand] = useState(0);

    const [ReedsIngeplandeOperatorShiftenHuidigeMaand, setReedsIngeplandeOperatorShiftenHuidigeMaand] = useState(0);
    const [ReedsIngeplandeOperatorShiftenVolgendeMaand, setReedsIngeplandeOperatorShiftenVolgendeMaand] = useState(0);

    const [NonOperatorExtraDezeMaand, setNonOperatorExtraDezeMaand] = useState(0);
    const [OperatorExtraDezeMaand, setOperatorExtraDezeMaand] = useState(0);
    const [NonOperatorExtraVolgendeMaand, setNonOperatorExtraVolgendeMaand] = useState(0);
    const [OperatorExtraVolgendeMaand, setOperatorExtraVolgendeMaand] = useState(0);

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const dispatch = useDispatch();


    const checkNextMonth = () => {
        let aantalDagen = 0
        calendar[0].employeeCalendar.forEach(shiftDay => {
            if (moment(shiftDay.day, "DD-MM-YYYY").isSame(moment(datum, "MM-YYYY").add(1, "month"), "month")) {
                aantalDagen++;
            }
        });
        setAantalShiftsVoorVolgendeMaand(aantalDagen * 4);

    }

    const checkExtraInTePlannenShiften = () =>{
        let nonOperatorDezeMaand = 0;
        let nonOperatorVolgendeMaand = 0;
        let OperatorDezeMaand = 0;
        let OperatorVolgendeMaand = 0;
        nonOperatorConfig.forEach(x=>{
            nonOperatorDezeMaand+=x.extra_operatorshiften;
            nonOperatorVolgendeMaand+=x.extra_operatorshiften_volgende_maand;
        });

        OperatorConfig.forEach(x=>{
            OperatorDezeMaand+=x.extra_operatorshiften;
            OperatorVolgendeMaand+=x.extra_operatorshiften_volgende_maand;
        });

        setNonOperatorExtraDezeMaand(nonOperatorDezeMaand);
        setOperatorExtraDezeMaand(OperatorDezeMaand);

        setNonOperatorExtraVolgendeMaand(nonOperatorVolgendeMaand);
        setOperatorExtraVolgendeMaand(OperatorVolgendeMaand);

    }

    const checkAantalIngeplandeOperatorShiften = () => {
        let aantalShiftenDezeMaand = 0;
        let aantalShiftenVolgendeMaand = 0;

        calendar.forEach(emp => {
            emp.employeeCalendar.forEach(shiftDay => {
                if (shiftDay.shift === "0618" || shiftDay.shift === "0719" || shiftDay.shift === "1806" || shiftDay.shift === "1907") {
                    if (moment(shiftDay.day, "DD-MM-YYYY").isSame(moment(datum, "MM-YYYY").add(1, "month"), "month")) {
                        aantalShiftenVolgendeMaand++;
                    } else {
                        aantalShiftenDezeMaand++;
                    }

                }
            })
        })

        setReedsIngeplandeOperatorShiftenHuidigeMaand(aantalShiftenDezeMaand);
        setReedsIngeplandeOperatorShiftenVolgendeMaand(aantalShiftenVolgendeMaand);

    }


    useEffect(() => {

        checkNextMonth();
        setAantalInTePlannenOperatorShiften(MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum, "MM-YYYY")) * 4)
        checkAantalIngeplandeOperatorShiften();
        checkExtraInTePlannenShiften();

        return () => {

        }
    }, [calendar, nonOperatorConfig, OperatorConfig])
    return (
        <div>
            <div class="card-body" style={{ fontSize: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "2px", padding: "0px" }}># operator shifts : {AantalInTePlannenOperatorShiften}</p>
                    <p style={{ margin: "2px", padding: "0px" }}>reeds ingepland: {ReedsIngeplandeOperatorShiftenHuidigeMaand + ReedsIngeplandeOperatorShiftenVolgendeMaand}</p>
                    <p style={{ margin: "2px", padding: "0px" }}>nog te voldoen: <span style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>{AantalInTePlannenOperatorShiften - ReedsIngeplandeOperatorShiftenVolgendeMaand - ReedsIngeplandeOperatorShiftenHuidigeMaand}</span></p>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p style={{ margin: "2px", padding: "0px" }}>tot 31-04-2021: {AantalInTePlannenOperatorShiften - AantalShiftsVoorVolgendeMaand}</p>
                        <p style={{ margin: "2px", padding: "0px" }}>Reeds ingepland:{ReedsIngeplandeOperatorShiftenHuidigeMaand} </p>
                        <p style={{ margin: "2px", padding: "0px" }}>Te voldoen: <span style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}> {AantalInTePlannenOperatorShiften - AantalShiftsVoorVolgendeMaand - ReedsIngeplandeOperatorShiftenHuidigeMaand}</span></p>

                        <b>NIET OPERATOR:</b>
                        <p>aantal shifts:{NonOperatorExtraDezeMaand}</p>
                        <b>OPERATOR:</b>
                        <p>aantal shifts:{OperatorExtraDezeMaand}</p>

                        <p style={{ margin: "2px", padding: "0px" }}>Voldaan: <span style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}> {NonOperatorExtraDezeMaand + OperatorExtraDezeMaand }</span></p>
                    </div>
                    <div className="col-6">

                        <p style={{ margin: "2px", padding: "0px" }}>vanaf 01-04-2021:  {AantalShiftsVoorVolgendeMaand}</p>
                        <p style={{ margin: "2px", padding: "0px" }}>Reeds ingepland:{ReedsIngeplandeOperatorShiftenVolgendeMaand} </p>
                        <p style={{ margin: "2px", padding: "0px" }}>Te voldoen: <span style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}> {AantalShiftsVoorVolgendeMaand - ReedsIngeplandeOperatorShiftenVolgendeMaand}</span></p>

                        <b>NIET OPERATOR:</b>
                        <p>aantal shifts:{NonOperatorExtraVolgendeMaand}</p>
                        <b>OPERATOR:</b>
                        <p>aantal shifts:{OperatorExtraVolgendeMaand}</p>

                        <p style={{ margin: "2px", padding: "0px" }}>Voldaan: <span style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}> {NonOperatorExtraVolgendeMaand + OperatorExtraVolgendeMaand}</span></p>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default BetaBezettingsgraadV2
