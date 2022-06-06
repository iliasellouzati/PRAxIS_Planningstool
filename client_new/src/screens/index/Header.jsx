import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';



const Header = () => {

  // eslint-disable-next-line no-restricted-globals
  const [CurrentScreen, setCurrentScreen] = useState(location.pathname.split('/'));

  useHistory().listen((location) => setCurrentScreen(location.pathname.split('/')));

  const [HeaderText, setHeaderText] = useState("XXX")

  // eslint-disable-next-line no-restricted-globals
  console.log(location.pathname.split('/'));

  useEffect(() => {

    switch (CurrentScreen[1]) {
      case "planningen":
        if (CurrentScreen[4] !== undefined) {
          setHeaderText(`Planning ${moment(parseInt(CurrentScreen[3]), "MM").format('MMMM').charAt(0).toUpperCase()}${moment(parseInt(CurrentScreen[3]), "MM").format('MMMM').slice(1)} ${CurrentScreen[2]} - Versie ${CurrentScreen[4]} aanpassen `)
        } else {
          setHeaderText(`Planning voor ${CurrentScreen[2]}`)
        }

        break;

      case "werknemers":
        if (CurrentScreen[2] !== undefined) {

          if (CurrentScreen[2] === 'new') {
            setHeaderText(`Nieuwe werknemer toevoegen `)
          } else {
            setHeaderText(`Werknemer met ID: ${CurrentScreen[2]} aanpassen`)
          }
        } else {
          setHeaderText(`Werknemers overzicht`)
        }
        break;


        case "shifttypes":
          if (CurrentScreen[2] !== undefined) {
  
            if (CurrentScreen[2] === 'new') {
              setHeaderText(`Nieuwe shift type toevoegen`)
            } else {
              setHeaderText(`Shift type  met ID: ${CurrentScreen[2]} aanpassen`)
            }
          } else {
            setHeaderText(`Shift types overzicht`)
          }
          break;

          
        case "contracttypes":
          if (CurrentScreen[2] !== undefined) {
  
            if (CurrentScreen[2] === 'new') {
              setHeaderText(`Nieuwe contract type toevoegen`)
            } else {
              setHeaderText(`Contract type  met ID: ${CurrentScreen[2]} aanpassen`)
            }
          } else {
            setHeaderText(`Contract types overzicht`)
          }
          break;

          case "weekstructuren":
            if (CurrentScreen[2] !== undefined) {
    
              if (CurrentScreen[2] === 'new') {
                setHeaderText(`Nieuwe week structuur toevoegen`)
              } else {
                setHeaderText(`Week structuur  met ID: ${CurrentScreen[2]} aanpassen`)
              }
            } else {
              setHeaderText(`Week structuren overzicht`)
            }
            break;

            case "feestdagen":
              if (CurrentScreen[3] !== undefined) {
      
                if (CurrentScreen[3] === 'new') {
                  setHeaderText(`Nieuwe feestdag toevoegen voor ${CurrentScreen[2]}`)
                } else {
                  setHeaderText(`Feestdag met ID: ${CurrentScreen[3]} aanpassen`)
                }
              } else {
                setHeaderText(`Feestdagen overzicht voor ${CurrentScreen[2]}`)
              }
              break;

      case "historie":
        setHeaderText(`Planning ${moment(parseInt(CurrentScreen[3]), "MM").format('MMMM').charAt(0).toUpperCase()}${moment(parseInt(CurrentScreen[3]), "MM").format('MMMM').slice(1)} ${CurrentScreen[2]} - Saved Versie ${CurrentScreen[4]} READ-ONLY `)
        break;

      default:
        setHeaderText('Server status')
        break;
    }




  }, [CurrentScreen])



  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars" /></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a className="nav-link">{HeaderText}</a>
        </li>
        {/* <li className="nav-item d-none d-sm-inline-block"><FPSStats top={'5px'} left={'700px'} /></li> */}

      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">

        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" role="button">
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>

      </ul>
    </nav>
  )
}

export default Header