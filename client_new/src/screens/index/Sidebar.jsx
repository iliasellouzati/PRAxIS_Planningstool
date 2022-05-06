import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { SideBarLinks } from '../../helpers/sidebar_links';
import { kleurenpallet } from './kleurenpallet';

const Sidebar = () => {

  // eslint-disable-next-line no-restricted-globals
  const [CurrentScreen, setCurrentScreen] = useState(location.pathname.split('/')[1]);

  useHistory().listen((location) => setCurrentScreen(location.pathname.split('/')[1]));



  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 " style={{ backgroundColor: kleurenpallet.sidebar_achtergrondkleur }} >

      <Link to="/" className="brand-link">
        <img src="/dist/img/ICOON.ico" alt="PRAxIS_Logo" class="brand-image img-circle elevation-3" style={{opacity: ".8"}}/>
          <span class="brand-text font-weight-light">Planning</span>
      </Link>
 

      <div className="sidebar" style={{ paddingLeft: "0px", paddingRight: '0px' }}>

        <div className="user-panel mt-3 pb-3 mb-3 d-flex">

          <div className="info">
            <Link to="/" className="d-block">Mario Schroyen</Link>
          </div>
        </div>


        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

            {SideBarLinks.map(obj =>
              <li className="nav-item"
                style={(CurrentScreen || "home") === obj.naam ?
                  {
                    backgroundColor: kleurenpallet.sidebar_selected_achtergrondkleur, borderLeft: `2px solid ${kleurenpallet.sidebar_selected_left_border_rood}`
                  } :
                  {}}
              >

                <Link to={obj.link} className={`nav-link`} style={{ color: kleurenpallet.sidebar_textkleur }}>
                  <i className={`nav-icon ${obj.icon}`} />
                  <p>
                    {obj.naam}
                  </p>
                </Link>

              </li>

            )}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar