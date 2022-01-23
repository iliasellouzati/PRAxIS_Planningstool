import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

import Header from './screens/Header';
import Footer from './screens/Footer';

import HomeScreen from './screens/Home';
import EmployeeScreen from './screens/EmployeesScreen';

import ShiftTypesScreen from './screens/ShiftTypesScreen';

import NotImplementedYet from './screens/NotImplementedYet';
import EditShifttypeScreen from './screens/EditShifttypeScreen';
import EditEmployeeScreen from './screens/EditEmployeeScreen';
import CalendarOvervieuwScreen from './screens/CalendarOvervieuwScreen';
import scheduleScreen2 from './screens/scheduleScreen2';
import RapportenScreen from './screens/RapportenScreen';
import RapportenIndividueelScreen from './screens/RapportenIndividueelScreen';
import RapportenStatistieken from './screens/RapportenStatistieken';
import RapportenPlanningScreen from './screens/RapportenPlanningScreen';
import ContactTypesScreen from './screens/ContractTypesScreen';
import EditContracttypeScreen from './screens/EditContracttypeScreen';
import BetaScreen from './screens/BetaScreen';
import InstellingenScreen from './screens/InstellingenScreen';
import WeekConfiguratiesScreen from './screens/WeekConfiguratiesScreen';
import EditWeekStructuurScreen from './screens/EditWeekStructuurScreen';
import BetaScreenV2 from './screens/BetaScreenV2';

function App() {


  return (
    <BrowserRouter >


      <Header />
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4" >
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <span className="brand-text font-weight-light">Planningstool</span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">

            <div className="info">
              <Link to="/" className="d-block">USERNAME</Link>
            </div>
          </div>
          -
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

              {/*MAAK PLANNING*/}
              <li className="nav-item menu-open">
                <Link to="/BETA">

                  <div className="nav-link ">
                    <i className="nav-icon fas fa-magic" />
                    <p>
                      Maak Planning V1
                    </p>

                  </div>
                </Link>
              </li>

              <li className="nav-item menu-open">
                <Link to="/BETA-V2">

                  <div className="nav-link active">
                    <i className="nav-icon fas fa-magic" />
                    <p>
                      Maak Planning V2
                    </p>

                  </div>
                </Link>
              </li>

              {/*HISTORIE*/}
              <li className="nav-item">
                <Link to="/historie" className="nav-link">
                  <i className="nav-icon fas fa-table" />
                  <p>
                    Historie
                  </p>
                </Link>

              </li>
              {/*WERKNEMERS*/}
              <li className="nav-item">
                <Link className="nav-link" to="/werknemers">
                  <i className="nav-icon fas fa-robot" />
                  <p>
                    Werknemers
                  </p>
                </Link>
              </li>

              {/*SHIFTTYPES*/}
              <li className="nav-item">
                <Link className="nav-link" to="/Shifttypes">
                  <i className="nav-icon fas fa-list-ol" />
                  <p>
                    Shifttypes
                  </p>
                </Link>

              </li>

              {/*CONTRACTTYPES*/}
              <li className="nav-item">
                <Link className="nav-link" to="/contract">
                  <i class=" nav-icon far fa-address-card" />
                  <p>
                    Contracttypes
                  </p>
                </Link>

              </li>

              {/*CONTRACTTYPES*/}
              <li className="nav-item">
                <Link className="nav-link" to="/instellingen">
                  <i class=" nav-icon fas fa-cogs" />
                  <p>
                    instellingen
                  </p>
                </Link>

              </li>

              {/*EXPORTEER*/}
              <li className="nav-item">
                <Link to="/Rapporten" className="nav-link">
                  <i className="nav-icon fas fa-file-excel" />
                  <p>
                    Rapporten

                  </p>
                </Link>

              </li>



            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
      <div>
        <Route path="/Werknemers" component={EmployeeScreen} exact={true} />
        <Route path="/Werknemers/:id" component={EditEmployeeScreen} />
        <Route path="/Shifttypes/:id" component={EditShifttypeScreen} />
        <Route path="/Shifttypes" component={ShiftTypesScreen} exact={true} />
        <Route path="/BETA" component={BetaScreen} exact={true} />
        <Route path="/BETA-V2" component={BetaScreenV2} exact={true} />
        <Route path="/Planning/:id" component={scheduleScreen2} />
        <Route path="/Rapporten/individueel" component={RapportenIndividueelScreen} />
        <Route path="/Rapporten/statistieken" component={RapportenStatistieken} />
        <Route path="/Rapporten/planning" component={RapportenPlanningScreen} />
        <Route path="/Rapporten" component={RapportenScreen} exact={true} />
        <Route path="/contract/:id" component={EditContracttypeScreen} />
        <Route path="/contract" component={ContactTypesScreen} exact={true} />
        <Route path="/instellingen/week/:id" component={EditWeekStructuurScreen} />
        <Route path="/instellingen/week" component={WeekConfiguratiesScreen} exact={true} />
        <Route path="/instellingen" component={InstellingenScreen} exact={true} />
        <Route path="/Historie" component={CalendarOvervieuwScreen} />
        <Route path="/" exact={true} component={HomeScreen} />
      </div>

      <Footer />

    </BrowserRouter >




  );
}

export default App;
