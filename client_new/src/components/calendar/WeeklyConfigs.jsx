import React from 'react'

const WeeklyConfigs = ({ config, index, setConfig, employeeId, weekNumber }) => {

    const changeConfig = (index, ChangeNight, weekNumber) => {
        let hulpConfig = [...config];
        if (ChangeNight)
            hulpConfig[index][weekNumber].night = !hulpConfig[index][weekNumber].night;
        else
            hulpConfig[index][weekNumber].weekend = !hulpConfig[index][weekNumber].weekend;

        setConfig(hulpConfig);

    }


    return (
        <div class="row" style={{ padding: "0px" }}>
            <div style={{ fontSize: "12px", padding: "0px" }} className="col-md-6">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id={`${employeeId}-${weekNumber}-night`} checked={config[index][weekNumber].night} onClick={() => { changeConfig(index, true, weekNumber) }} />
                    <label for={`${employeeId}-${weekNumber}-night`} class="custom-control-label" >Nacht? </label>
                </div>
            </div>
            <div style={{ fontSize: "12px", padding: "0px" }} className="col-md-6">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id={`${employeeId}-${weekNumber}-weekend`} checked={config[index][weekNumber].weekend} onClick={() => { changeConfig(index, false, weekNumber) }} />
                    <label for={`${employeeId}-${weekNumber}-weekend`} class="custom-control-label" >Wknd? </label>
                </div>
            </div>
        </div>
    )
}

export default WeeklyConfigs