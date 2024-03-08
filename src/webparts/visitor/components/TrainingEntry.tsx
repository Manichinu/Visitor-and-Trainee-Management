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
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';



SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;
// let eventList: any = [];
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
    SelectedDate: any;
    SelectedEventItems: any[];
    CurrentView: any;
    EditScreen: boolean;
    EditItemID: number;
    PreviousFiles: any[];
    EditRequestID: any;
}

export default class TrainingEntry extends React.Component<IVisitorProps, FormState, {}> {
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {
            UpcomingEvents: [],
            SelectedDate: "",
            SelectedEventItems: [],
            CurrentView: "month",
            EditScreen: false,
            EditItemID: 0,
            PreviousFiles: [],
            EditRequestID: ""
        }
        NewWeb = Web("" + this.props.siteurl + "")
        this.handleNavigate = this.handleNavigate.bind(this);
    }
    public componentDidMount() {
        // eventList.push(
        //     {
        //         id: "1",
        //         title: "Test",
        //         start: "03/08/2024 10:15",
        //         end: "03/08/2024 12:15"

        //     }
        // )
        this.GetEvents()
    }
    // public GetEvents() {
    //     NewWeb.lists.getByTitle("Training Master Transaction").items.select("*").get()
    //         .then((items: any) => {
    //             if (items.length != 0) {
    //                 for (var i = 0; i < items.length; i++) {
    //                     eventList.push({
    //                         id: items[i].ID,
    //                         title: items[i].Title,
    //                         start: "" + moment(items[i].StartDate, "DD-MM-YYYY hh:mm A").format("MM/DD/YYYY HH:mm") + "",
    //                         end: "" + moment(items[i].EndDate, "DD-MM-YYYY hh:mm A").format("MM/DD/YYYY HH:mm") + "",
    //                         category: items[i].EmployeeCategory
    //                     })
    //                 }
    //                 this.setState({
    //                     UpcomingEvents: eventList
    //                 })
    //             }
    //         })
    // }
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
    public handleNavigate(newDate: any) {
        var handler = this;
        $("#table-example").hide();
        $("#form").show();
        handler.setState({
            CurrentView: "month",
            EditScreen: false
        })
    }
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

        $("#table-example").show();
        $("#form").hide();
    }
    public async getFilesForRequestId(requestId: string) {
        try {
            await NewWeb.lists.getByTitle('Training Attachments')
                .items
                .select('*')
                .filter(`RequestID eq '${requestId}'`)
                .expand("File")
                .get()
                .then((files: any) => {
                    if (files.length != 0) {
                        console.log(files)
                        const fileNames = files.map((file: any) => file.File.Name);
                        return fileNames;

                    }
                })

        } catch (error) {
            console.error('Error fetching files for RequestID:', error);
            return [];
        }
    }
    public deleteItem(id: number) {
        swal({
            title: "Are you sure?",
            text: "You want to delete this item!",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                NewWeb.lists.getByTitle("Training Master Transaction").items.getById(id).delete().then(() => {
                    swal({
                        text: "Deleted successfully!!",
                        icon: "success",
                    }).then(() => {
                        location.reload();
                    })
                })
            }
        })
    }
    public editItem(id: number) {
        this.setState({
            EditScreen: true,
            EditItemID: id
        })
        $("#table-example").hide();
        $("#form").show();
        NewWeb.lists.getByTitle("Training Master Transaction").items.select("*").filter(`ID eq ${id}`).get().then((items: any) => {
            if (items.length != 0) {
                $("#training_name").val(items[0].Title)
                $("#training_type").val(items[0].TrainingType)
                $("#venue").val(items[0].Venue)
                $("#start_date").val(moment(items[0].StartDate, "DD-MM-YYYY hh:mm A").format("YYYY-MM-DDTHH:mm"))
                $("#end_date").val(moment(items[0].EndDate, "DD-MM-YYYY hh:mm A").format("YYYY-MM-DDTHH:mm"))
                $("#per_slot").val(items[0].MaximumPerSlot)
                $("#employee_category").val(items[0].EmployeeCategory)
                this.getFilesFromLibrary(items[0].RequestID)

            }
        })
    }
    public UpdateItem() {
        var StartDate = $("#start_date").val()
        var FormatStartDate = moment(StartDate).format('DD-MM-YYYY hh:mm A')
        var EndDate = $("#end_date").val()
        var FormatEndDate = moment(EndDate).format('DD-MM-YYYY hh:mm A')
        NewWeb.lists.getByTitle("Training Master Transaction").items.getById(this.state.EditItemID).update({
            Title: $("#training_name").val(),
            TrainingType: $("#training_type").val(),
            Venue: $("#venue").val(),
            StartDate: FormatStartDate,
            EndDate: FormatEndDate,
            MaximumPerSlot: $("#per_slot").val(),
            EmployeeCategory: $("#employee_category").val(),
        }).then(async () => {
            var FoldeName = $("#training_name").val()

            var FileInput: any = $("#attachments")
            var Files = FileInput[0].files
            if (Files.length != 0) {
                for (var i = 0; i < Files.length; i++) {
                    const data = await NewWeb.getFolderByServerRelativeUrl(
                        this.props.context.pageContext.web.serverRelativeUrl + `/Training Attachments/${FoldeName}`
                    ).files.add(Files[i].name, Files[i], true);

                    const fileItem = await data.file.getItem();
                    await fileItem.update({
                        RequestID: this.state.EditRequestID,
                    });
                }
            }
        }).then(() => {
            swal({
                text: "Updated successfully!",
                icon: "success",
            }).then(() => {
                location.reload();
            })
        })
    }
    public async getFilesFromLibrary(id: any) {
        this.setState({
            EditRequestID: id
        })
        await NewWeb.lists.getByTitle('Training Attachments')
            .items
            .select('*')
            .filter(`RequestID eq '${id}'`)
            .expand("File")
            .get()
            .then((files: any) => {
                if (files.length != 0) {
                    console.log("Files", files)
                    this.setState({
                        PreviousFiles: files
                    })
                }
            })
    }

    public render(): React.ReactElement<IVisitorProps> {
        return (
            <>
                <div>

                    {/* <Calendar /> */}
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
                <div className="add-event-page" id='form' style={{ display: "none" }}>
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
                            <div>
                                {this.state.EditScreen == true && (
                                    this.state.PreviousFiles.map((item) => {
                                        return (
                                            <a href={item.File.ServerRelativeUrl} target='_blank'>{item.File.Name}</a>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="row send-invite-btn-wrap">
                        <div className="send_button required"><div className="w-130 td-div send-invite">
                            {this.state.EditScreen == false ?
                                <button className="btn-wrap" onClick={() => this.saveFormDetails()}>Submit</button>
                                : <button className="btn-wrap" onClick={() => this.UpdateItem()}>Update</button>
                            } </div></div>
                    </div>
                </div>
                <div className="manual-booking-table view-event-table">
                    <div className="table-responsive" id="table-content">
                        <table className="table" id="table-example" style={{ display: "none" }}>
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
                                    <th>Action</th>
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
                                            <td>
                                                {item.Files.length !== 0 ? (
                                                    item.Files.map((item: any) => (
                                                        <a href={item.URL} target={'_blank'}>{item.name}</a>
                                                    ))
                                                ) : "-"}
                                            </td>

                                            <td>
                                                <img onClick={() => this.editItem(item.ID)} src={`${this.props.siteurl}/SiteAssets/Visitor%20and%20Trainee%20Assets/images/edit.svg`} />
                                                <img onClick={() => this.deleteItem(item.ID)} src={`${this.props.siteurl}/SiteAssets/Visitor%20and%20Trainee%20Assets/images/close-icon.svg`} />
                                            </td>

                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>

                    </div>
                </div>

            </>
        );
    }
}
