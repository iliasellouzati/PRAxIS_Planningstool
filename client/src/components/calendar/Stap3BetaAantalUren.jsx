import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { addAmountOfNONOperatorShifts, addAmountOfOperatorShifts, addAmountOfNONOperatorShiftsForNextMonth, addAmountOfOperatorShiftsForNextMonth } from '../../store/actions/betaActions';


const Stap3BetaAantalUren = ({ employeeId, nonEmployee, employeeCalendar, aantalUurInKwartaal, contracttype }) => {

    const dispatch = useDispatch();


    const [TotalHoursInCalendar, setTotalHoursInCalendar] = useState('');
    const [TotalHoursInKwartaal, setTotalHoursInKwartaal] = useState('')

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar, datum } = currentCalendar;

    const [ExtraOperatorShifts, setExtraOperatorShifts] = useState(0)
    const [ExtraOperatorShiftsVolgendeMaand, setExtraOperatorShiftsVolgendeMaand] = useState(0)


    const calculateHours = () => {
        let total = 0;
        let currentCalendarMonth = moment(datum, "MM-YYYY")
        employeeCalendar.forEach(shiftDay => {

            if (shiftDay.shift !== "") {
                let shift = shifttypes.find(o => o.naam === shiftDay.shift)
                let beginMoment = moment((shiftDay.day + "-" + shift.beginuur), "DD-MM-YYYY-hh:mm");
                let eindMoment = moment((shiftDay.day + "-" + shift.einduur), "DD-MM-YYYY-hh:mm");
                if (beginMoment.isAfter(eindMoment)) {
                    eindMoment.add(1, 'day');
                }
                let duration = moment.duration(eindMoment.diff(beginMoment));

                if (beginMoment.isSame(currentCalendarMonth, "month") && eindMoment.isSame(currentCalendarMonth, "month")) {
                    total += (duration.asHours());
                } else if (beginMoment.isSame(currentCalendarMonth, "month")) {
                    eindMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                } else if (eindMoment.isSame(currentCalendarMonth, "month")) {
                    beginMoment.add(1, 'day');
                    beginMoment.set({ h: 0, m: 0 });
                    duration = moment.duration(eindMoment.diff(beginMoment));
                    total += (duration.asHours());
                }
            }

        });

        setTotalHoursInKwartaal(total + aantalUurInKwartaal);
        setTotalHoursInCalendar(total);

        let hulpValue = Math.floor(contracttype.maandelijke_contract_uren / 3) - total;

        setExtraOperatorShifts((Math.ceil(hulpValue / 12)<0 ? 0 : Math.ceil(hulpValue / 12)));
        if (nonEmployee) {
            dispatch(addAmountOfNONOperatorShifts(employeeId, ( (Math.ceil(hulpValue / 12)<0 ? 0 : Math.ceil(hulpValue / 12))))  )

        } else {
            dispatch(addAmountOfOperatorShifts(employeeId, (Math.ceil(hulpValue / 12))))

        }

    }

    const changeExtrasShifts = (newValue) => {
        setExtraOperatorShifts(newValue);
        if (nonEmployee) {
            dispatch(addAmountOfNONOperatorShifts(employeeId, newValue))

        } else {
            dispatch(addAmountOfOperatorShifts(employeeId, newValue))
        }

    }

    const changeExtrasShiftsNextMonth = (newValue) => {
        setExtraOperatorShiftsVolgendeMaand(newValue);
        if (nonEmployee) {
            dispatch(addAmountOfNONOperatorShiftsForNextMonth(employeeId, newValue))

        } else {
            dispatch(addAmountOfOperatorShiftsForNextMonth(employeeId, newValue))
        }

    }

    useEffect(() => {
        calculateHours();
        return () => {

        }
    }, [calendar])

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>


                <div>
                    Deze maand :
                    <b> {Math.round(TotalHoursInCalendar)} / {Math.floor(contracttype.maandelijke_contract_uren / 3)} </b>
                    ({Math.round(TotalHoursInCalendar * 100 / (contracttype.maandelijke_contract_uren / 3))}%)
                    &amp;
                    Dit kwartaal :
                    <b> {Math.round(TotalHoursInKwartaal)} / {contracttype.maandelijke_contract_uren} </b>
                    ({Math.round(TotalHoursInKwartaal * 100 / contracttype.maandelijke_contract_uren)} %)
                </div>
                {ExtraOperatorShifts > 0 &&
                    (<div>Met <span style={{ color: "red", fontWeight: "bold" }}> {ExtraOperatorShifts} </span> operatorshiften zal dit
                        <b> {Math.round(TotalHoursInCalendar) + (ExtraOperatorShifts * 12)} / {Math.floor(contracttype.maandelijke_contract_uren / 3)} </b>
                        ({Math.round((TotalHoursInCalendar + (12 * ExtraOperatorShifts)) * 100 / (contracttype.maandelijke_contract_uren / 3))}%)
                        &amp;
                        <b> {Math.round(TotalHoursInKwartaal + (ExtraOperatorShifts * 12))} / {contracttype.maandelijke_contract_uren} </b>
                        ({Math.round((TotalHoursInKwartaal + (ExtraOperatorShifts * 12)) * 100 / contracttype.maandelijke_contract_uren)}% )

                        <i style={{ color: "green", marginLeft: "15px", marginRight: "15px" }} class="fas fa-plus" onClick={() => changeExtrasShifts(ExtraOperatorShifts + 1)}></i>
                        <i style={{ color: "red", marginLeft: "15px", marginRight: "15px" }} class="fas fa-minus" onClick={() => changeExtrasShifts(ExtraOperatorShifts - 1)}></i>
                    </div>)}




            </div>
            <div>

                Vanaf {moment(datum, "MM-YYYY").add(1, "month").startOf("month").format("DD-MM-YYYY")} mogen er nog <span style={{ color: "red", fontWeight: "bold" }}>{ExtraOperatorShiftsVolgendeMaand}</span> shiften bij

                <div>
                    <i style={{ color: "green", marginLeft: "15px", marginRight: "15px" }} class="fas fa-plus" onClick={() => changeExtrasShiftsNextMonth(ExtraOperatorShiftsVolgendeMaand + 1)}></i>
                    <i style={{ color: "red", marginLeft: "15px", marginRight: "15px" }} class="fas fa-minus" onClick={() => changeExtrasShiftsNextMonth(ExtraOperatorShiftsVolgendeMaand - 1)}></i>
                </div>

            </div>

            <div>
                Op deze planning:
                <p><span style={{ color: "red", fontWeight: "bold" }}>{ExtraOperatorShifts + ExtraOperatorShiftsVolgendeMaand}</span> operator shiften</p>
            </div>

        </div>

    )




}

export default Stap3BetaAantalUren

