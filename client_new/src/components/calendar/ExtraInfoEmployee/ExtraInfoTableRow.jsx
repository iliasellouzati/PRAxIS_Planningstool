import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import MarioStats from './customStats/MarioStats';
import OperatorDagStats from './customStats/OperatorDagStats';

const ExtraInfoTableRow = ({ stats ,employeeId}) => {

    const { month, year } = useParams();

    let dataArray = ["operator", "dag operator", "nacht operator", "coopman", "praxis", "cumul", "verlof", "ziekte", "standby"];
    let intervalArray = ["maand", "kwartaal", "jaar"];
    let jaarInterval = [[`${year}`, `${year}`]]
    let kwartaalInterval = [["I", 1], ["II", 2], ["III", 3], ["IV", 4]]
    let monthInterval = [["jan", `01-${year}`], ["febr", `02-${year}`], ["maa", `03-${year}`], ["apr", `04-${year}`], ["mei", `05-${year}`], ["jun", `06-${year}`], ["jul", `07-${year}`], ["aug", `08-${year}`], ["sep", `09-${year}`], ["okt", `10-${year}`], ["nov", `11-${year}`], ["dec", `12-${year}`]]


    const [ShowCustom, setShowCustom] = useState(false);
    const [DataType, setDataType] = useState(dataArray[0]);
    const [Interval, setInterval] = useState(intervalArray[0]);
    const [SelectedValue, setSelectedValue] = useState(`01-${year}`);
    const [PossibleValues, setPossibleValues] = useState(monthInterval)



    useEffect(() => {


        switch (Interval) {
            case "maand":
                setPossibleValues(monthInterval);
                setSelectedValue(monthInterval[0][1]);
                break;

            case "kwartaal":
                setPossibleValues(kwartaalInterval);
                setSelectedValue(kwartaalInterval[0][1]);

                break;

            case "jaar":
                setPossibleValues(jaarInterval);
                setSelectedValue(jaarInterval[0][1]);

                break;
            default:
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Interval])


    return (
        <React.Fragment >
            <div style={{ padding: "0px", height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                <div style={ShowCustom ? { padding: "0px", height: "20%", width: "20%", display: 'flex', flexDirection: 'column', textAlign: 'center', font: '11px ', cursor: 'pointer' } : { padding: "0px", height: "100%", width: "5%", display: 'flex', flexDirection: 'column', font: '11px ', cursor: 'pointer' }}>


                    <div className="form-group" style={ShowCustom ? { height: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center', padding: '0px', margin: '0px' } : { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0px', margin: '0px' }} >

                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => false)} style={{ marginLeft: '7px' }}>
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="MARIO" checked={!ShowCustom} />
                            <label for="MARIO" class="custom-control-label" >Mario</label>
                        </div>

                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => true)} style={{ marginLeft: '7px' }} >
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="CUSTOM" checked={ShowCustom} />
                            <label for="CUSTOM" class="custom-control-label" >Custom</label>
                        </div>

                    </div>

                    {ShowCustom &&
                        <div className="row" style={{ height: '75%', padding: '0px', margin: '0px' }}>

                            <div class="col-sm-4" >

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Data</label>
                                    <select class="form-control" onChange={e => setDataType(e.target.value)}>
                                        {dataArray.map(dataName => <option value={dataName} key={dataName}>{dataName}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Interval</label>
                                    <select class="form-control" onChange={e => setInterval(e.target.value)}>
                                        {intervalArray.map(interval => <option value={interval} key={interval}>{interval}</option>)}

                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">

                                <div class="form-group">
                                    <label style={{ margin: '2px' }}>Selectie</label>
                                    <select class="form-control" onChange={e => setSelectedValue(e.target.value)}>
                                        {PossibleValues.map(monthVal => <option value={monthVal[1]} key={monthVal[1]}>{monthVal[0]}</option>)}
                                    </select>
                                </div>
                            </div>

                        </div>
                    }

                </div>
                <div style={ShowCustom ? { padding: "0px", height: "100%", width: "80%", border: '1px solid black', textAlign: 'center' } : { padding: "0px", height: "100%", width: "95%", border: '1px solid black', textAlign: 'center' }}>

                    {ShowCustom ?
                        {
                            "operator": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "dag operator": <OperatorDagStats  employeeId ={employeeId} stats={stats} Interval={Interval} SelectedValue={SelectedValue} />,
                            "nacht operator": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "coopman": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "praxis": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "cumul": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "verlof": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "ziekte": `${DataType} - ${Interval} - ${SelectedValue}`,
                            "standby": `${DataType} - ${Interval} - ${SelectedValue}`
                        }[DataType]

                        : <MarioStats />}

                </div>
            </div>

        </React.Fragment>
    )
}

export default ExtraInfoTableRow