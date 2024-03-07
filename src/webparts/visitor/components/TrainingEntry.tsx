import * as React from 'react';
// import styles from './Visitor.module.scss';
import type { IVisitorProps } from './IVisitorProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import * as $ from "jquery";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/attachments";
import "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import "DataTables.net";
import 'datatables.net-dt/css/jquery.dataTables.css';
import swal from "sweetalert";
import * as moment from "moment";

// import * as $ from "jquery";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import * as moment from "moment";
// import { Calendar, momentLocalizer } from 'react-big-calendar'
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;
// const localizer = momentLocalizer(moment)

export interface FormState {
}

export default class TrainingEntry extends React.Component<IVisitorProps, FormState, {}> {
    // calendarComponentRef = React.createRef();
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {
        }
        NewWeb = Web("" + this.props.siteurl + "")

    }
    public componentDidMount() {
    }
    public async saveFormDetails() {
        var StartDate = $("#start_date").val()
        var FormatStartDate = moment(StartDate).format('DD-MM-YYYY hh:mm A')
        var EndDate = $("#end_date").val()
        var FormatEndDate = moment(EndDate).format('DD-MM-YYYY hh:mm A')
        var RequestID = "Training-" + moment().format("DDMMYYYYHHmmss")
        NewWeb.lists.getByTitle("Training Master Transaction").items.add({
            Title: $("#training_name").val(),
            TrainingType: $("#training_type").val(),
            Venue: $("#venue").val(),
            StartDate: FormatStartDate,
            EndDate: FormatEndDate,
            MaximumPerSlot: $("#per_slot").val(),
            RequestID: RequestID,
            EmployeeCategory: $("#employee_category").val(),
        }).then(async () => {
            var FoldeName = $("#training_name").val()

            var FileInput: any = $("#attachments")
            var Files = FileInput[0].files
            if (Files.length != 0) {
                NewWeb.lists.getByTitle('Training Attachments').rootFolder.folders.add(FoldeName);
                for (var i = 0; i < Files.length; i++) {
                    const data = await NewWeb.getFolderByServerRelativeUrl(
                        this.props.context.pageContext.web.serverRelativeUrl + `/Training Attachments/${FoldeName}`
                    ).files.add(Files[i].name, Files[i], true);

                    const fileItem = await data.file.getItem();
                    await fileItem.update({
                        RequestID: RequestID,
                    });
                }
            }

        }).then(() => {
            swal({
                text: "Submitted successfully!",
                icon: "success",
            }).then(() => {
                location.reload();
            })
        })
    }

    public render(): React.ReactElement<IVisitorProps> {


        return (
            <>
                <div>
                    {/* <FullCalendar
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        ref={this.calendarComponentRef}
                        defaultView="dayGridMonth"
                        dateClick={this.handleDateClick}
                        displayEventTime={true}
                        header={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                        }}
                        selectable={true}
                        plugins={[
                            dayGridPlugin,
                            interactionPlugin,
                            timeGridPlugin,
                            resourceTimeGridPlugin
                        ]}
                        eventClick={event => {
                            console.log(event.event._def.publicId);
                        }}
                        //   events={this.state.events}
                        select={this.handleSelectedDates}
                        eventLimit={3}
                    /> */}
                    {/* <Calendar
                        localizer={localizer}
                        // events={myEventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    /> */}
                    <Calendar />

                </div>
                <div className="add-event-page" style={{ display: "none" }}>
                    <div className="row">
                        <div className="col-md-3 required"><label>Training Name</label><span>*</span>
                            <input type="text" id="training_name" autoComplete='off' className='form-control'
                                placeholder="Training Name"
                            />
                        </div>
                        <div className="col-md-3 required"><label>Training Type</label><span>*</span>
                            <input type="text" id="training_type" autoComplete='off' className='form-control'
                                placeholder="Training Type"
                            />
                        </div>
                        <div className="col-md-3 required"><label>Venue</label><span>*</span>
                            <input type="text" id="venue" autoComplete='off' className='form-control'
                                placeholder="Venue"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 required"><label>Start Date</label><span>*</span>
                            <input type="datetime-local" id="start_date" autoComplete='off' className='form-control'
                                placeholder="Start Date"
                            />
                        </div>
                        <div className="col-md-3 required"><label>End Date</label><span>*</span>
                            <input type="datetime-local" id="end_date" autoComplete='off' className='form-control'
                                placeholder="End Date"
                            />
                        </div>
                        <div className="col-md-3 required"><label>Maximum per slot</label><span>*</span>
                            <input type="text" id="per_slot" autoComplete='off' className='form-control'
                                placeholder="Maximum per slot"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 required"><label>Employee Category</label><span>*</span>
                            <select id="employee_category" autoComplete='off' className='form-control'>
                                <option value="">--Select--</option>
                                <option value="Managerial">Managerial</option>
                                <option value="Other">Other</option>
                            </select>


                        </div>
                        <div className="col-md-3 required"><label>Attachments</label><span>*</span>
                            <input type="file" id="attachments" autoComplete='off' className='form-control'
                                multiple
                            />
                        </div>

                    </div>
                    <div className="row send-invite-btn-wrap">
                        <div className="send_button required"><div className="w-130 td-div send-invite"><button className="btn-wrap" onClick={() => this.saveFormDetails()}>Submit</button></div></div>
                    </div>
                </div>

            </>
        );
    }
}
