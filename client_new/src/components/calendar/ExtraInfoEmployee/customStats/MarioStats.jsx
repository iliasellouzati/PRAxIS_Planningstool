import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
const MarioStats = ({ stats, shifttypes }) => {


    const { month, year } = useParams();

    const currMonth = `${month}-${year}`;

    const currMonthMoment = moment(currMonth, "MM-YYYY");

    const currKwartaal = currMonthMoment.quarter();

    console.log(stats);

    const calcHoursShift = (shiftDay) => {

        let shift = shifttypes.find(x => x.id === shiftDay.shifttype_id);


        let duratie = moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() >= 0 ?
            moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
            moment.duration(moment((shiftDay.einduur ? `${shiftDay.datum}-${shiftDay.einduur}` : `${shiftDay.datum}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.beginuur ? `${shiftDay.datum}-${shiftDay.beginuur}` : `${shiftDay.datum}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()

    return duratie;
        }


    useEffect(() => {
        console.log(currKwartaal)

    }, [])



    return (
        <React.Fragment>
            <thead>
                <tr>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" OPERATORUREN INCL. COOPMAN OPERATOR UREN"}>OU</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL DAGSHIFTEN DEZE MAAND "}>TGM</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL DAGSHIFTEN CUMUL"}>TDC</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL GEWERKTE NACHT DEZE MAAND"}>TGNM</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL NACHT JAAR"}>TNC</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" UREN VORIGE MAAND"}>UVM</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL UREN JAAR"}>TUC</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" UREN VOORBIJE MAAND(EN) KWARTAAL"}>UVMKW</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" HUIDIG KWARTAAL"}>TUKW</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" #AANGEVRAAGDE VRIJE FEESTDAG"}>FX</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" GEWERKTE WEEKENDS DEZE MAAND"}>GWDM</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" TOTAAL GEWERKTE WEEKENDS"}>TGW</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" STANDBY MAAND"}>SB</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" SB CUMUL "}>SBC</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" VERLOF"}>V</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" ONBETAALD VERLOF"}>OV</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" ANCIENITEIT"}>A</th>
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={" UITZONDERINGSDAG"}>U</th>
                    

                </tr>
            </thead>
            <tbody>
                <tr>

                    <td style={{ padding: "1px" }}>
                        {
                            Math.round((stats.maand[currMonth].dag_operator.totaalUrenOpKalender + stats.maand[currMonth].dag_operator.urenUitVorigeMaand +
                                stats.maand[currMonth].nacht_operator.totaalUrenOpKalender + stats.maand[currMonth].nacht_operator.urenUitVorigeMaand +
                                stats.maand[currMonth].coopman.totaalUrenOpKalender) * 100) / 100
                        }
                    </td>
                    <td style={{ padding: "1px" }}>{stats.maand[currMonth].dag_operator.totaalAantalShiften}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].dag_operator.totaalAantalShiften, 0)}</td>
                    <td style={{ padding: "1px" }}>{stats.maand[currMonth].nacht_operator.totaalAantalShiften}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].nacht_operator.totaalAantalShiften, 0)}</td>
                    <td style={{ padding: "1px" }}>{Math.round((stats.maand[currMonth].cumul.totaalUrenOpKalender + stats.maand[currMonth].cumul.urenUitVorigeMaand) * 100) / 100}</td>
                    <td style={{ padding: "1px" }}>{Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand), 0)) * 100) / 100}</td>
                    <td style={{ padding: "1px" }}>{Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (moment(currVal, "MM-YYYY").isSame(currMonthMoment, 'quarter') && moment(currVal, "MM-YYYY").isBefore(currMonthMoment, 'month') ? (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand) : 0), 0)) * 100) / 100}</td>
                    <td style={{ padding: "1px" }}>{Math.round((Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (moment(currVal, "MM-YYYY").isSame(currMonthMoment, 'quarter') ? (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand) : 0), 0)) * 100) / 100}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x => shifttypes.find(y=>y.id===  x.shifttype_id).naam.includes('feestdag')).length), 0)}</td>
                    <td style={{ padding: "1px" }}>{stats.maand[currMonth].weekends.gepland_met_shifts.length}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += stats.maand[currVal].weekends.gepland_met_shifts.length, 0)}</td>
                    <td style={{ padding: "1px" }}>{stats.maand[currMonth].standby.totaalAantalShiften}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].standby.totaalAantalShiften), 0)}</td>
                    <td style={{ padding: "1px" }}>{Math.round(( Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x =>  shifttypes.find(y=>y.id===  x.shifttype_id).naam.includes('verlof')).reduce((acc,val)=>acc+=calcHoursShift(val),0 ) ), 0))*100)/100}</td>
                    <td style={{ padding: "1px" }}>{Math.round(( Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x =>  shifttypes.find(y=>y.id===  x.shifttype_id).naam.includes('onbetaald')).reduce((acc,val)=>acc+=calcHoursShift(val),0 ) ), 0))*100)/100}</td>
                    <td style={{ padding: "1px" }}>{Math.round(( Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x =>  shifttypes.find(y=>y.id===  x.shifttype_id).naam.includes('ancienniteit')).reduce((acc,val)=>acc+=calcHoursShift(val),0 ) ), 0))*100)/100}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].verlof.shiftDb.filter(x =>  shifttypes.find(y=>y.id===  x.shifttype_id).naam.includes('uitzonderingsdag')).length), 0) }</td>
                </tr>

                <tr>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>
                    <td style={{ padding: "1px", color: 'blue' }}> <i className="fas fa-thin fa-glasses"></i> </td>

                </tr>

            </tbody>
        </React.Fragment>)
}

export default MarioStats