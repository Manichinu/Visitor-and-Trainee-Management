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
import TrainingEntry from './TrainingEntry';
import TrainingInvitee from './TrainingInvitee';


SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;



export interface VisitorState {
  VisitorSection: boolean;
  TraineeSection: boolean;
  VisitorEntry: boolean;
  VisitorDetails: boolean;
  CurrentUserName: string;
  CurrentUserID: number;
  UserInVisitorGroup: boolean;
  UserInTrainingGroup: boolean;
  TrainingEntry: boolean;
  TrainingInvitee: boolean;

}

export default class Visitor extends React.Component<IVisitorProps, VisitorState, {}> {
  public constructor(props: IVisitorProps, state: VisitorState) {
    super(props);
    this.state = {
      VisitorEntry: true,
      VisitorDetails: false,
      VisitorSection: true,
      TraineeSection: false,
      CurrentUserName: "",
      CurrentUserID: 0,
      UserInVisitorGroup: false,
      UserInTrainingGroup: false,
      TrainingEntry: false,
      TrainingInvitee: false
    }
    NewWeb = Web("" + this.props.siteurl + "")
    console.log(NewWeb)
  }
  public toggleLogout() {
    $(".btn-log-out").toggle();
  }
  public componentDidMount() {
    $(".side_navbar").on('click', function () {
      $(".side_navbar").removeClass('active');
      $(this).addClass('active');
    })
    this.GetCurrentUserDetails()
  }
  public async GetCurrentUserDetails() {
    await NewWeb.currentUser.get().then((user: any) => {
      console.log(user);
      this.setState({
        CurrentUserName: user.Title,
        CurrentUserID: user.Id
      })
    }, (errorResponse: any) => {
    }
    );
    this.isUserinVisitorGroup()

  }
  public async isUserinVisitorGroup() {
    var handler = this;

    const ajaxRequest = () => {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${this.props.siteurl}/_api/web/sitegroups/getByName('Visitor Management Users')/Users?$filter=Id eq ${this.state.CurrentUserID}`,
          type: "GET",
          headers: { 'Accept': 'application/json; odata=verbose;' },
          success: function (resultData) {
            console.log(resultData);
            resolve(resultData);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error while checking user in Owner's group");
            reject(errorThrown);
          }
        });
      });
    };

    try {
      const resultData: any = await ajaxRequest();

      if (resultData.d.results.length !== 0) {
        handler.setState({
          UserInVisitorGroup: true
        });
      }

      // Continue with the next function
      this.isUserinTrainingGroup();
    } catch (error) {
      console.error("Error in isUserinVisitorGroup:", error);
    }
  }
  public async isUserinTrainingGroup() {
    var handler = this
    $.ajax({
      url: `${this.props.siteurl}/_api/web/sitegroups/getByName('Training Management Users')/Users?$filter=Id eq ${this.state.CurrentUserID}`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log(resultData)
        if (resultData.d.results.length != 0) {
          handler.setState({
            UserInTrainingGroup: true
          })
          if (handler.state.UserInVisitorGroup == false) {
            handler.TraineeSection()
            $("#Training").addClass('active')
          }
        }
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error while checking user in userTraining group");
      }

    });
    setTimeout(() => {
      $(".header_part").on('click', function () {
        $(".header_part").removeClass('active');
        $(this).addClass('active');
      })
    }, 200)

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
  public trainingEntry() {
    this.setState({
      TrainingEntry: true,
      TrainingInvitee: false
    })
  }
  public trainingInvitee() {
    this.setState({
      TrainingInvitee: true,
      TrainingEntry: false
    })
  }
  public VisitorSection() {
    this.setState({
      VisitorSection: true,
      TraineeSection: false,
      VisitorEntry: true,
      VisitorDetails: false
    })
    setTimeout(() => {
      $(".side_navbar").on('click', function () {
        $(".side_navbar").removeClass('active');
        $(this).addClass('active');
      })
    }, 200)
  }
  public TraineeSection() {
    this.setState({
      VisitorSection: false,
      TraineeSection: true,
      TrainingEntry: true,
      TrainingInvitee: false
    })
    setTimeout(() => {
      $(".side_navbar").on('click', function () {
        $(".side_navbar").removeClass('active');
        $(this).addClass('active');
      })
    }, 200)

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
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/icon.svg" className="calender" />Visitor and Training Management
                        <div className="calender-dot">

                        </div>
                      </a>
                    </li>
                    {this.state.UserInVisitorGroup == true &&
                      <li className="active header_part" id="Visitor" onClick={() => this.VisitorSection()}>
                        <a href="#" className="showStoreClick">
                          <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />
                          <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store-en.svg" className="store-img-h" /> Visitor
                        </a>
                      </li>
                    }
                    {this.state.UserInTrainingGroup == true &&
                      <li className="header_part" id="Training" onClick={() => this.TraineeSection()}>
                        <a href="#" className="showEventBookingClick">
                          <img className="event-img" src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/event.svg" alt="image" />
                          <img className="event-img-h" src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/event-h.svg" alt="image" />Training

                        </a>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </header>
          <div className="store-section">
            <div className="row store-wrap">
              <div className="column-1">
                <ul className='left-nav-menus-stack'>
                  {this.state.VisitorSection == true && this.state.UserInVisitorGroup == true &&
                    <>
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
                    </>
                  }
                  {this.state.TraineeSection == true &&
                    <>
                      <li className="active side_navbar" id='arrow-img' onClick={() => this.trainingEntry()}>
                        <div className="clearfix booking add-store"> <a href="#" className="clearfix">
                          <div className="f-left" id='add_store'><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />Training Entry</div>
                        </a></div>
                      </li>
                      <li className="side_navbar" id='arrow-img' onClick={() => this.trainingInvitee()}>
                        <div className="clearfix booking add-store"> <a href="#" className="clearfix">
                          <div className="f-left" id='add_store'><img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />Training Invitee</div>
                        </a></div>
                      </li>
                    </>
                  }

                </ul>
              </div>
              <div className='clearfix manual-right'>
                {this.state.VisitorEntry == true && this.state.VisitorSection == true && this.state.UserInVisitorGroup == true &&
                  <VisitorEntry siteurl={this.props.siteurl} context={this.props.context} />
                }
                {this.state.VisitorDetails == true && this.state.VisitorSection == true && this.state.UserInVisitorGroup == true &&
                  <VisitorDetails siteurl={this.props.siteurl} context={this.props.context} />
                }
                {this.state.TrainingEntry == true && this.state.TraineeSection == true &&
                  <TrainingEntry siteurl={this.props.siteurl} context={this.props.context} />
                }
                {this.state.TrainingInvitee == true && this.state.TraineeSection == true &&
                  <TrainingInvitee siteurl={this.props.siteurl} context={this.props.context} />
                }

              </div>
            </div>


          </div>
        </section>

      </>
    );
  }
}
