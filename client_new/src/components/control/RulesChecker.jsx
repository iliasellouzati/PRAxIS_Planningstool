import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RulesChecker = () => {

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { calendar } = currentCalendar;

  const [Prio1, setPrio1] = useState([]);
  const [Prio2, setPrio2] = useState([]);
  const [Prio3, setPrio3] = useState([]);


  useEffect(() => {


    return () => {

    }
  }, [calendar])



  return (
    <div className="card collapsed-card">
      <div className="card-header border-0">
        <h3 className="card-title">Controle regels</h3>
        <div className="card-tools">
          <div class="card-tools">
          <button type="button" class="btn  btn-sm"  title="Eindcontrole">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn  btn-sm"  title="refresh">
              <i class="fas fa-redo-alt"></i>
            </button>
            <button type="button" class="btn  btn-sm" data-card-widget="collapse" title="Collapse">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center  border-bottom mb-3">
          <p className="text-danger text-xl">
            <i className="fas fa-ban"></i>
          </p>
          <p className="d-flex flex-column text-right">
            <span className="font-weight-bold">
              <i className="ion ion-android-arrow-down text-danger"></i> 1%
            </span>
            <span className="text-muted">REGISTRATION RATE</span>
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
          <p className="text-warning text-xl">
            <i className="fas fa-exclamation-triangle"></i>
          </p>
          <p className="d-flex flex-column text-right">
            <span className="font-weight-bold">
              <i className="ion ion-android-arrow-up text-warning"></i> 0.8%
            </span>
            <span className="text-muted">SALES RATE</span>
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-0">

          <p className=" text-xl">
            <i className="fas fa-question"></i>
          </p>

          <p className="d-flex flex-column text-right">
            <span className="font-weight-bold">
              <i className="ion ion-android-arrow-up text-info"></i> 12%
            </span>
            <span className="text-muted">CONVERSION RATE</span>
          </p>
        </div>




      </div>
    </div>
  )
}

export default RulesChecker