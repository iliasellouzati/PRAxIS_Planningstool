import React from 'react'

const TempFile3 = () => {
    return (
        <div className="card" style={{ position: "relative", left: "0px", top: "0px" }}>
            <div className="card-header ui-sortable-handle" style={{ cursor: "move" }}>
                <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i>
                    Sales
                </h3>
                <div className="card-tools">
                    <ul className="nav nav-pills ml-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="#revenue-chart" data-toggle="tab">Area</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#sales-chart" data-toggle="tab">Donut</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card-body">
                <div className="tab-content p-0">

                    <div className="chart tab-pane active" id="revenue-chart" style={{ position: "relative", height: "300px" }}><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className=""></div></div><div className="chartjs-size-monitor-shrink"><div className=""></div></div></div>
                        <canvas id="revenue-chart-canvas" height="300" style={{ height: "300px", display: "block", width: "900" }} width="900" className="chartjs-render-monitor"></canvas>
                    </div>
                    <div className="chart tab-pane" id="sales-chart" style={{ position: "relative", height: "300px" }}>
                        <canvas id="sales-chart-canvas" height="0" style={{ height: "0px", display: "block", width: "0" }} className="chartjs-render-monitor" width="0"></canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TempFile3