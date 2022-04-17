import React, { useEffect, useState } from 'react';
import MarioStats from './customStats/MarioStats';

const ExtraInfoTableRow = ({ stats }) => {

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

    const [ShowCustom, setShowCustom] = useState(false)

    const over = (e) => {
        e.target.style.backgroundColor = "#A9A9A9";


    }
    const out = (e) => {
        e.target.style.backgroundColor = "#E5E4E2";
    }


    return (
        <React.Fragment >
            <div style={{ padding: "0px", height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                <div style={ShowCustom ? { padding: "0px", height: "20%", width: "20%", display: 'flex', flexDirection: 'column', textAlign: 'center', font: '11px ', cursor: 'pointer' } : { padding: "0px", height: "100%", width: "5%", display: 'flex', flexDirection: 'column', font: '11px ', cursor: 'pointer' }}>


                    <div className="form-group" style={ShowCustom ? { height: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center', padding: '0px', margin: '0px' } : { height: '100%', display: 'flex', flexDirection: 'column',  justifyContent: 'space-between', padding: '0px', margin: '0px' }} >

                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => false)} style={{ marginLeft:'7px' }}>
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="MARIO" checked={!ShowCustom} />
                            <label for="MARIO" class="custom-control-label" >Mario</label>
                        </div>

                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => true)} style={{ marginLeft:'7px' }} >
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="CUSTOM" checked={ShowCustom} />
                            <label for="CUSTOM" class="custom-control-label" >Custom</label>
                        </div>

                    </div>

                    {ShowCustom &&
                        <div className="row" style={{ height: '75%', padding: '0px', margin: '0px' }}>

                            <div class="col-sm-4" >

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Data</label>
                                    <select class="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Interval</label>
                                    <select class="form-control" >
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Selectie</label>
                                    <select class="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    }


                    {/* 
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

                 {
                        {


                            false: <MaandStats stats={stats ? stats.maand : null} />,
                            true: <KwartaalStats />

                        }[ShowCustom]
                    }


                     */}

                </div>
                <div style={ShowCustom ? { padding: "0px", height: "100%", width: "80%", border: '1px solid black',textAlign:'center' } : { padding: "0px", height: "100%", width: "95%", border: '1px solid black',textAlign:'center' }}>

                    {ShowCustom ? "Custum" : <MarioStats />}



                </div>
            </div>

        </React.Fragment>
    )
}

export default ExtraInfoTableRow