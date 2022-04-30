import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
const MarioStats = ({ stats }) => {


    const { month, year } = useParams();

    const currMonth = `${month}-${year}`;
    const lastMonth = moment(currMonth,"MM-YYYY").subtract(1,"month").format("MM-YYYY");

    console.log(stats);

    let hulpArr = [
        " OPERATORUREN + COOPMAN 2U + COOPMAN DAG", "OU", //maand
        " TOTAAL DAGSHIFTEN DEZE MAAND ", " TGDM ", //maand
        " TOTAAL DAGSHIFTEN CUMUL ", " TDC ", //jaar
        " TOTAAL GEWERKTE NACHT DEZE MAAND ", " TGNM ", //maand
        " TOTAAL NACHT JAAR ", " TNC ",//jaar
        " UREN VORIGE MAAND ", " UVM ", //maand
        " TOTAAL UREN JAAR ", " TUC ", //jaar
        " UREN VOORBIJE MAAND(EN) KWARTAAL ", " UVMKW ", //kwartaal
        " HUIDIG KWARTAAL ", " TUKW ", //kwartaal
        " #AANGEVRAAGDE VRIJE FEESTDAG ", " ??? ", //verlof
        " GEWERKTE WEEKENDS DEZE MAAND ", " GWDM ",//maand +weekend
        " TOTAAL GEWERKTE WEEKENDS ", " TGW", //jaar + weekend
        " STANDBY MAAND ", "SB",//maand + sb
        " SB CUMUL ", "SBC",//jaar + sb
        " VERLOF ANCIENITEIT/ONBETAALD VERLOF/UITZONDERINGSDAG ", " ??? " //verlof
    ]

    useEffect(() => {
      
   
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
                    <th style={{ padding: "1px", width: '96px', cursor: 'pointer' }} title={"  GEWERKTE WEEKENDS DEZE MAAND"}>GWDM</th>
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
                    <td style={{ padding: "1px" }}>{stats.maand[currMonth].cumul.totaalUrenOpKalender+stats.maand[currMonth].cumul.urenUitVorigeMaand}</td>
                    <td style={{ padding: "1px" }}>{Object.keys(stats.maand).reduce((accumulator, currVal) => accumulator += (stats.maand[currVal].cumul.totaalUrenOpKalender + stats.maand[currVal].cumul.urenUitVorigeMaand), 0)}</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>
                    <td style={{ padding: "1px" }}>x</td>

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