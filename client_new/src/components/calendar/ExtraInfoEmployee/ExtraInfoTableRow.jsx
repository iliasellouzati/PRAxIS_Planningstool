import React, { useState } from 'react';
import MaandStats from './MaandStats';
import KwartaalStats from './KwartaalStats';
import JaarStats from './JaarStats';
import StandbyStats from './StandbyStats';
import VerlofStats from './VerlofStats';
import WeekendStats from './WeekendStats';

const ExtraInfoTableRow = () => {

    let ToDoArray = [
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

    const [Selected, setSelected] = useState(0);


    const over = (e) => {
        e.target.style.backgroundColor = "#A9A9A9";


    }
    const out = (e) => {
        e.target.style.backgroundColor = "#E5E4E2";
    }


    return (
        <React.Fragment >
            <div style={{ padding: "0px", height: '75px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center' }}>

                <div style={{ padding: "0px", height: "100%", width: "137px", display: 'flex', flexDirection: 'column', textAlign: 'center', font: '11px ', cursor: 'pointer' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', height: '34%', justifyContent: 'space-around', textAlign: 'center' }} >
                        <div onMouseOver={Selected !== 0 ? over : ''} onMouseOut={Selected !== 0 ? out : ""} style={Selected === 0 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(0)}>
                            Mnd
                        </div>
                        <div onMouseOver={Selected !== 1 ? over : ''} onMouseOut={Selected !== 1 ? out : ""} style={Selected === 1 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(1)}>
                            Kwrtl
                        </div>

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', height: '33%', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div onMouseOver={Selected !== 2 ? over : ''} onMouseOut={Selected !== 2 ? out : ""} style={Selected === 2 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(2)}>
                            Jaar
                        </div>
                        <div onMouseOver={Selected !== 3 ? over : ''} onMouseOut={Selected !== 3 ? out : ""} style={Selected === 3 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(3)}>
                            SB's
                        </div>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', height: '33%', justifyContent: 'space-around', textAlign: 'center' }}>

                        <div onMouseOver={Selected !== 4 ? over : ''} onMouseOut={Selected !== 4 ? out : ""} style={Selected === 4 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(4)}>
                            Wknd
                        </div>
                        <div onMouseOver={Selected !== 5 ? over : ''} onMouseOut={Selected !== 5 ? out : ""} style={Selected === 5 ? { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#00FF00', fontWeight: 'Bold' } : { border: "1px solid black", width: "50%", height: '100%', backgroundColor: '#E5E4E2' }} onClick={() => setSelected(5)}>
                            Verlof
                        </div>
                    </div>

                </div>
                <div style={{ padding: "0px", height: "100%", width: "100%", border: '1px solid black' }}>

                    
                {
                  {

                    0: <MaandStats/>,
                    1: <KwartaalStats/> ,
                    2: <JaarStats/>,
                    3: <StandbyStats/>,
                    4: <WeekendStats/>,
                    5: <VerlofStats/>
                  }[Selected]
                }


                </div>
            </div>

        </React.Fragment>
    )
}

export default ExtraInfoTableRow