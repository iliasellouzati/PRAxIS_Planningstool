import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MarioStats from './customStats/MarioStats';
import OperatorDagStats from './customStats/OperatorDagStats';
import OperatorNachtStats from './customStats/OperatorNachtStats';
import OperatorTotaalStats from './customStats/OperatorTotaalStats';
import CoopmanStats from './customStats/CoopmanStats';
import PraxisStats from './customStats/PraxisStats';
import CumulStats from './customStats/CumulStats';
import VerlofStats from './customStats/VerlofStats';
import ZiekteStats from './customStats/ZiekteStats';
import StandbyStats from './customStats/StandbyStats';
import WeekendStats from './customStats/WeekendStats';
import TableRowHistoryEmployee from '../TableRowHistoryEmployee';

const ExtraInfoTableRow = ({ stats, employeeId, shifttypes, length }) => {

    const {  year } = useParams();

    let dataArray = ["operator", "dag operator", "nacht operator", "coopman", "praxis", "cumul", "verlof", "ziekte", "standby", "weekend"];
    let intervalArray = ["maand", "kwartaal", "jaar"];
    let jaarInterval = [[`${year}`, `${year}`]]
    let kwartaalInterval = [["I", 0], ["II", 1], ["III", 2], ["IV", 3]]
    let monthInterval = [["jan", `01-${year}`], ["febr", `02-${year}`], ["maa", `03-${year}`], ["apr", `04-${year}`], ["mei", `05-${year}`], ["jun", `06-${year}`], ["jul", `07-${year}`], ["aug", `08-${year}`], ["sep", `09-${year}`], ["okt", `10-${year}`], ["nov", `11-${year}`], ["dec", `12-${year}`]]

    const [ShowHistory, setShowHistory] = useState(false);

    const [ShowCustom, setShowCustom] = useState(false);
    const [DataType, setDataType] = useState(dataArray[0]);
    const [Interval, setInterval] = useState(intervalArray[0]);
    const [SelectedValue, setSelectedValue] = useState(`01-${year}`);
    const [PossibleValues, setPossibleValues] = useState(monthInterval);
    const [Loading, setLoading] = useState(false);



    useEffect(() => {
        setLoading(true);

        switch (Interval) {

            case "maand":
                setSelectedValue(["maand", monthInterval[0][1]]);
                setPossibleValues(monthInterval);
                break;

            case "kwartaal":
                setSelectedValue(["kwartaal", kwartaalInterval[0][1]]);
                setPossibleValues(kwartaalInterval);

                break;

            case "jaar":
                setSelectedValue(["jaar", jaarInterval[0][1]]);
                setPossibleValues(jaarInterval);

                break;
            default:
                break;
        }

        setLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Interval])


    return (
        <React.Fragment >
            {!Loading && typeof stats !== 'undefined' &&
                <React.Fragment>


                    {ShowHistory === true &&
                        <tr style={{height: "27px"}}>
                            <TableRowHistoryEmployee shifttypes={shifttypes} employeeId={employeeId} length={length} />
                        </tr>}


                    <tr>
                        <td colSpan={length + 3}>
                            <div style={{ padding: "0px", height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                <div style={ShowCustom ? { padding: "0px", height: "20%", width: "20%", display: 'flex', flexDirection: 'column', textAlign: 'center', font: '11px ', cursor: 'pointer' } : { padding: "0px", height: "100%", width: "5%", display: 'flex', flexDirection: 'column', font: '11px ', cursor: 'pointer' }}>


                                    <div className="form-group" style={ShowCustom ? { height: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center', padding: '0px', margin: '0px' } : { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0px', margin: '0px' }} >

                                        <div class="custom-control custom-checkbox" style={{ marginLeft: '7px' }} >
                                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id={`History_${employeeId}`} checked={ShowHistory} onClick={() => setShowHistory(!ShowHistory)} />
                                            <label for={`History_${employeeId}`} class="custom-control-label" >History</label>
                                        </div>

                                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => false)} style={{ marginLeft: '7px' }}>
                                            <input class="custom-control-input custom-control-input-danger" type="checkbox" for={`Mario_${employeeId}`} checked={!ShowCustom} />
                                            <label for={`Mario_${employeeId}`} class="custom-control-label" >Mario</label>
                                        </div>

                                        <div class="custom-control custom-checkbox" onClick={() => setShowCustom(() => true)} style={{ marginLeft: '7px' }} >
                                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id={`Custom_${employeeId}`} checked={ShowCustom} />
                                            <label for={`Custom_${employeeId}`} class="custom-control-label" >Custom</label>
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
                                                    <select class="form-control" onChange={e => setSelectedValue([Interval, e.target.value])}>
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
                                            "operator": <OperatorTotaalStats stats={stats} SelectedValue={SelectedValue} />,
                                            "dag operator": <OperatorDagStats stats={stats} SelectedValue={SelectedValue} />,
                                            "nacht operator": <OperatorNachtStats stats={stats} SelectedValue={SelectedValue} />,
                                            "coopman": <CoopmanStats stats={stats} SelectedValue={SelectedValue} />,
                                            "praxis": <PraxisStats stats={stats} SelectedValue={SelectedValue} />,
                                            "cumul": <CumulStats stats={stats} SelectedValue={SelectedValue} />,
                                            "verlof": <VerlofStats stats={stats} SelectedValue={SelectedValue} />,
                                            "ziekte": <ZiekteStats stats={stats} SelectedValue={SelectedValue} />,
                                            "standby": <StandbyStats stats={stats} SelectedValue={SelectedValue} />,
                                            "weekend": <WeekendStats stats={stats} SelectedValue={SelectedValue} />
                                        }[DataType]

                                        : <MarioStats stats={stats} />}

                                </div>
                            </div>
                        </td>
                    </tr>




                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default ExtraInfoTableRow