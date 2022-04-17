import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import MarioStats from './customStats/MarioStats';

const ExtraInfoTableRow = ({ stats }) => {

    const { month, year } = useParams();

    let dataArray = ["operator", "dag operator", "nacht operator", "coopman", "praxis", "cumul", "verlof", "ziekte", "standby"];
    let intervalArray = ["maand", "kwartaal", "jaar"];



    const [ShowCustom, setShowCustom] = useState(false);
    const [DataType, setDataType] = useState(dataArray[0]);
    const [Interval, setInterval] = useState(intervalArray[0]);
    const [SelectedValue, setSelectedValue] = useState(1);
    const [PossibleValues, setPossibleValues] = useState([1]);


    const over = (e) => {
        e.target.style.backgroundColor = "#A9A9A9";


    }
    const out = (e) => {
        e.target.style.backgroundColor = "#E5E4E2";
    }

    useEffect(() => {
        let currMonth = moment(`${month}-${year}`, "MM-YYYY");
        setSelectedValue(1);

        switch (Interval) {
            case "maand":
                setPossibleValues([...Array(currMonth.month() + 1).keys()].map(i => i + 1));
                break;

            case "kwartaal":
                setPossibleValues([...Array(currMonth.quarter()).keys()].map(i => i + 1));
                break;

            case "jaar":
                setPossibleValues([1]);
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
                                        {PossibleValues.map(selectie => <option value={selectie} key={selectie}>{selectie}</option>)}
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
                            "dag operator": `${DataType} - ${Interval} - ${SelectedValue}`,
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