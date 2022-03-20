import React from 'react'

const TempFile4 = () => {
    return (
        <div className="card bg-gradient-primary">
            <div className="card-header border-0 ui-sortable-handle" style={{ cursor: "move" }}>
                <h3 className="card-title">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    Visitors
                </h3>

                <div className="card-tools">
                    <button type="button" className="btn btn-primary btn-sm daterange" title="Date range">
                        <i className="far fa-calendar-alt"></i>
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" data-card-widget="collapse" title="Collapse">
                        <i className="fas fa-minus"></i>
                    </button>
                </div>

            </div>


            <div className="card-footer bg-transparent">
                <div className="row">
                    <div className="col-4 text-center">
                        <div id="sparkline-1"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                        <div className="text-white">Visitors</div>
                    </div>

                    <div className="col-4 text-center">
                        <div id="sparkline-2"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                        <div className="text-white">Online</div>
                    </div>

                    <div className="col-4 text-center">
                        <div id="sparkline-3"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                        <div className="text-white">Sales</div>
                    </div>

                </div>

            </div>
        </div>)
}

export default TempFile4