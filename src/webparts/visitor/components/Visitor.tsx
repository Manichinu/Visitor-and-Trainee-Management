import * as React from 'react';
// import styles from './Visitor.module.scss';
import type { IVisitorProps } from './IVisitorProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import * as $ from "jquery";
import VisitorEntry from './VisitorEntry';
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/attachments";
import "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import VisitorDetails from './VisitorDetails';




SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;



export interface VisitorState {
  VisitorEntry: boolean;
  VisitorDetails: boolean;
}

export default class Visitor extends React.Component<IVisitorProps, VisitorState, {}> {
  public constructor(props: IVisitorProps, state: VisitorState) {
    super(props);
    this.state = {
      VisitorEntry: true,
      VisitorDetails: false
    }
    NewWeb = Web("" + this.props.siteurl + "")
    console.log(NewWeb)
  }
  public toggleLogout() {
    $(".btn-log-out").toggle();
  }
  public componentDidMount() {
    $(".header_part").on('click', function () {
      $(".header_part").removeClass('active');
      $(this).addClass('active');
    })
    $(".side_navbar").on('click', function () {
      $(".side_navbar").removeClass('active');
      $(this).addClass('active');
    })
  }
  public visitorEntry() {
    this.setState({
      VisitorEntry: true,
      VisitorDetails: false
    })
  }
  public visitorDetails() {
    this.setState({
      VisitorEntry: false,
      VisitorDetails: true
    })
  }


  public render(): React.ReactElement<IVisitorProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;

    return (
      <>
        <section id='load-content'>
          <header>
            <div >
              <div className="container">
                <div id="header-section">
                  <div className="lan-section switcher">
                    <div className="action toggle switcher-trigger AED" id="switcher-currency-trigger">
                      <strong className="language-AED">
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/AED.png" alt="" />
                        <span className="AED">AED</span>
                        <div className="lan-dropdown">
                          <span className="english">ENGLISH</span>
                        </div>
                      </strong>
                    </div>

                  </div>
                  <div className="logo-br">
                    <a href=""><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/logo.png" alt="Luxury Gallery"
                      width="250" height="50" /></a>
                  </div>

                  <div className="notification-part ">
                    <ul>
                      <li onClick={() => this.toggleLogout()}><a href="#"> <i className="fa fa-fw fa-user"></i>
                        <div className="btn-log-out" style={{ display: "none" }}>
                          <a href="https://login.microsoftonline.com/common/oauth2/logout"><span><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/logout.svg" data-themekey="#" className="logout-img" /></span> Log Out</a>
                        </div>
                      </a> </li>

                    </ul>
                  </div>
                </div>

              </div>
              <div className="notification-part booking-header ">
                <div className="container">
                  <ul>
                    <li>
                      <a href="#">
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/icon.svg" className="calender" />Appointment Booking
                        <div className="calender-dot">

                        </div>
                      </a>
                    </li>
                    <li className="active header_part" id="store">
                      <a href="#" className="showStoreClick">
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store-en.svg" className="store-img-h" /> Visitor
                      </a>
                    </li>
                    <li className="header_part" id="event">
                      <a href="#" className="showEventBookingClick">
                        <img className="event-img" src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/event.svg" alt="image" />
                        <img className="event-img-h" src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/event-h.svg" alt="image" />Trainee

                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>
          <div className="store-section">
            <div className="row store-wrap">
              <div className="column-1">
                <ul className='left-nav-menus-stack'>
                  <li className="active side_navbar" id='arrow-img' onClick={() => this.visitorEntry()}>
                    <div className="clearfix booking add-store"> <a href="#" className="clearfix">
                      <div className="f-left" id='add_store'><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />Visitor Entry</div>
                    </a></div>
                  </li>
                  <li className="side_navbar" id='arrow-img' onClick={() => this.visitorDetails()}>
                    <div className="clearfix booking add-store"> <a href="#" className="clearfix">
                      <div className="f-left" id='add_store'><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />Visitor Details</div>
                    </a></div>
                  </li>

                </ul>
              </div>
              <div className='clearfix manual-right'>
                {this.state.VisitorEntry == true &&
                  <VisitorEntry siteurl={this.props.siteurl} />
                }
                {this.state.VisitorDetails == true &&
                  <VisitorDetails siteurl={this.props.siteurl} />
                }

              </div>
            </div>


          </div>
        </section>

      </>
    );
  }
}
