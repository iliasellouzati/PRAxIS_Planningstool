/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'



const header = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars" /></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a className="nav-link">Home</a>
        </li>

      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">


        {/* Notifications Dropdown Menu */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown">
            <i className="far fa-bell" />
            <span className="badge badge-warning navbar-badge">5</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">5 Meldingen</span>
            <div className="dropdown-divider" />
            <a className="dropdown-item">
              <i className="fas fa-envelope mr-2" /> 2 Wissel aanvragen
              <span className="float-right text-muted text-sm">3 dagen</span>
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item">
              <i className="fas fa-users mr-2" />1 Verlof aanvragen
              <span className="float-right text-muted text-sm">1 dag</span>
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item">
              <i className="fas fa-file mr-2" /> 2 Opmerkingen
              <span className="float-right text-muted text-sm">1 week</span>
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item dropdown-footer">Zie alle meldingen</a>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" role="button">
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>

      </ul>
    </nav>
  )
}

export default header