import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { SideBarLinks } from '../../helpers/sidebar_links';

const Sidebar = () => {

  // eslint-disable-next-line no-restricted-globals
  const [CurrentScreen, setCurrentScreen] = useState(location.pathname.split('/')[1]);

  useHistory().listen((location) => setCurrentScreen(location.pathname.split('/')[1]));


  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 " >


      <Link to="/" className="brand-link">
        <span className="brand-text font-weight-light">Planningstool</span>
      </Link>

      <div className="sidebar ">


        <div className="user-panel mt-3 pb-3 mb-3 d-flex">

          <div className="info">
            <Link to="/" className="d-block">NO USER LOGGED IN</Link>
          </div>
        </div>
        

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

            {SideBarLinks.map(obj =>
              <li className="nav-item">

                <Link to={obj.link} className={`nav-link ${(CurrentScreen||"home") === obj.naam ? " active " : ""}}`}>
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