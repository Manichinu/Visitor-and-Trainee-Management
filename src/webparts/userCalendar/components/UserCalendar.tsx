import * as React from 'react';
// import styles from './UserCalendar.module.scss';
import type { IUserCalendarProps } from './IUserCalendarProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/attachments";
import "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as moment from "moment";
import * as $ from "jquery";



SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;
const localizer = momentLocalizer(moment)


export interface FormState {
  UpcomingEvents: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    category: string;
    className?: string; // Add className for styling
  }[];
  SelectedEventItems: any[];
  CurrentView: any;
}

export default class UserCalendar extends React.Component<IUserCalendarProps, FormState, {}> {
  public constructor(props: IUserCalendarProps, state: FormState) {
    super(props);
    this.state = {
      UpcomingEvents: [],
      SelectedEventItems: [],
      CurrentView: "month",
    }
    NewWeb = Web("" + this.props.siteurl + "")
    this.handleNavigate = this.handleNavigate.bind(this);

  }
  public componentDidMount() {
    this.GetEvents()
  }
  public toggleLogout() {
    $(".btn-log-out").toggle();
  }
  public getEventStyle(event: any) {
    if (event.category == "Managerial") {
      return {
        className: 'eventscalender_green', // Add a class for styling
      };
    }
    else if (event.category == "Other") {
      return {
        className: 'eventscalender_yellow', // Add a class for styling
      };
    }
    return {};
  };
  public async handleEventClick(event: any, e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    const clickedDateEvents = this.state.UpcomingEvents.filter((ev) => {
      return (
        ev.start.getDate() === event.start.getDate() &&
        ev.start.getMonth() === event.start.getMonth() &&
        ev.start.getFullYear() === event.start.getFullYear()
      );
    });

    const promises = clickedDateEvents.map(async (item) => {
      const items = await NewWeb.lists.getByTitle("Training Master Transaction")
        .items.select("*").filter(`ID eq ${item.id}`).get();
      // return items[0];
      // const files = await this.getFilesForRequestId(items[0].RequestID);
      const Files = await NewWeb.lists.getByTitle('Training Attachments')
        .items
        .select('*')
        .filter(`RequestID eq '${items[0].RequestID}'`)
        .expand("File")
        .get()
        .then((files: any) => {
          var Files: any[] = []
          if (files.length != 0) {
            files.map((file: any) => {
              Files.push({ name: file.File.Name, URL: file.File.ServerRelativeUrl })
            });

          }
          return Files
        })
      console.log("Req", Files)
      return { ...items[0], Files };
    });


    const selectedEventItems = await Promise.all(promises);

    // Now you can display or handle the selectedEventItems as needed
    console.log('Events for clicked date:', selectedEventItems);

    this.setState({
      SelectedEventItems: selectedEventItems
    });

    $("#table-details").show();
  }
  public GetEvents() {
    NewWeb.lists.getByTitle("Training Master Transaction").items.select("*").get()
      .then((items: any) => {
        if (items.length !== 0) {
          const formattedEvents = items.map((item: any) => ({
            id: item.ID,
            title: item.Title,
            start: moment(item.StartDate, "DD-MM-YYYY hh:mm A").toDate(),
            end: moment(item.EndDate, "DD-MM-YYYY hh:mm A").toDate(),
            category: item.EmployeeCategory,
          }));

          this.setState({
            UpcomingEvents: formattedEvents
          });
        }
      });
  }
  public handleNavigate(newDate: any) {
    var handler = this;
    handler.setState({
      CurrentView: "month",
    })
    $("#table-details").hide()
  }
  public closeTable() {
    $("#table-details").hide();
  }
  public render(): React.ReactElement<IUserCalendarProps> {
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
                    <li className="active header_part" id="Visitor">
                      <a href="#" className="showStoreClick">
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store.svg" className="store-img" />
                        <img src="https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/images/store-en.svg" className="store-img-h" /> User Calendar
                      </a>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </header>
          <div className="store-section user-calendar">
            <div className="row store-wrap user_calendar">
              <Calendar
                localizer={localizer}
                events={this.state.UpcomingEvents}
                startAccessor="start"
                endAccessor="end"
                // views=""
                view={this.state.CurrentView}
                onView={(view) => this.setState({ CurrentView: view })}
                date=""
                eventPropGetter={this.getEventStyle}
                style={{ height: 405 }}
                onNavigate={this.handleNavigate}
                tooltipAccessor="category"
                onSelectEvent={(event, e) => this.handleEventClick(event, e)}
              />
            </div>
          </div>
          <div className='table-popup' style={{ display: "none" }} id='table-details'>
            <div className='table-overlay_popup'>
              <div className="manual-booking-table view-event-table user-calendar">
                <div className="table-responsive" id="table-content">
                  <h4 className="events_title">Event Details</h4>
                  <div className="popup_cancel" onClick={() => this.closeTable()}>
                    <img src={`${this.props.siteurl}/SiteAssets/Visitor%20and%20Trainee%20Assets/images/close-icon.svg`} />
                  </div>
                  <table className="table" id="table-example">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Venue</th>
                        <th>Training Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Employee Category</th>
                        <th>Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.SelectedEventItems && this.state.SelectedEventItems.map((item, key) => {
                        return (
                          <tr>
                            <td>{key + 1}</td>
                            <td>{item.Title}</td>
                            <td>{item.Venue}</td>
                            <td>{item.TrainingType}</td>
                            <td>{item.StartDate}</td>
                            <td>{item.EndDate}</td>
                            <td>{item.EmployeeCategory}</td>
                            <td className='files-section'>
                              {item.Files.length !== 0 ? (
                                item.Files.map((item: any) => (
                                  <a href={item.URL} target={'_blank'}>{item.name}</a>
                                ))
                              ) : "-"}
                            </td>


                          </tr>
                        )
                      })}

                    </tbody>

                  </table>

                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
