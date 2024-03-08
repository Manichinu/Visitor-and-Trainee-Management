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



SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;
// const localizer = momentLocalizer(moment)

export interface FormState {
    TrainingNames: any[];
    CategorySelected: boolean;
    CurrentUserName: string;
    CurrentUserID: number;
    CurrentUserEmail: string;
    SelectedTrainingName: string;
    StartDate: string;
    EndDate: string;
    EmployeeCategory: string;
}

export default class TrainingInvitee extends React.Component<IVisitorProps, FormState, {}> {
    // calendarComponentRef = React.createRef();
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {
            TrainingNames: [],
            CategorySelected: false,
            CurrentUserName: "",
            CurrentUserID: 0,
            CurrentUserEmail: "",
            SelectedTrainingName: "",
            StartDate: "",
            EndDate: "",
            EmployeeCategory: ""

        }
        NewWeb = Web("" + this.props.siteurl + "")

    }
    public async componentDidMount() {
        this.GetCurrentUserDetails();
        this.GetTrainingNames();
    }
    public async GetCurrentUserDetails() {
        await NewWeb.currentUser.get().then((user: any) => {
            console.log(user);
            this.setState({
                CurrentUserName: user.Title,
                CurrentUserID: user.Id,
                CurrentUserEmail: user.Email
            })
        }, (errorResponse: any) => {
        }
        );

    }
    public GetTrainingNames() {
        NewWeb.lists.getByTitle("Training Master Transaction").items.select("*").get()
            .then((items: any) => {
                if (items.length != 0) {
                    this.setState({
                        TrainingNames: items
                    })
                }
            })
    }
    public async saveFormDetails() {
        var RequestID = "Training-" + moment().format("DDMMYYYYHHmmss")
        NewWeb.lists.getByTitle("Training User Transaction").items.add({
            Title: $("#employee_name").val(),
            EmployeeCode: $("#employee_code").val(),
            EmailAddress: $("#email").val(),
            StartDate: this.state.StartDate,
            EndDate: this.state.EndDate,
            TrainingName: this.state.SelectedTrainingName,
            RequestID: RequestID,
            Category: this.state.EmployeeCategory
        }).then(() => {
            swal({
                text: "Submitted successfully!",
                icon: "success",
            }).then(() => {
                location.reload();
            })
        })
    }
    public selfCategory() {
        this.setState({
            CategorySelected: true
        })
        setTimeout(() => {
            $("#employee_name").val(this.state.CurrentUserName)
            $("#email").val(this.state.CurrentUserEmail)
        }, 200)
    }
    public otherCategory() {
        this.setState({
            CategorySelected: true
        })
        $("#employee_name").val("")
        $("#email").val("")
    }
    public GetSelectedTrainingDetails() {
        var SelectedOption = $("#training_names").val()
        NewWeb.lists.getByTitle("Training Master Transaction").items.select("*").filter(`Title eq '${SelectedOption}'`).get()
            .then((items: any) => {
                if (items.length != 0) {
                    this.setState({
                        SelectedTrainingName: items[0].Title,
                        StartDate: items[0].StartDate,
                        EndDate: items[0].EndDate,
                        EmployeeCategory: items[0].EmployeeCategory
                    })
                }
            })
    }

    public render(): React.ReactElement<IVisitorProps> {


        return (
            <>

                <div className="add-event-page training_invitee">
                    <div className="row">
                        <div className="col-md-3 required"><label>Training Booking for</label><span>*</span>
                            <div className='self-section' onClick={() => this.selfCategory()}>
                                <input type="radio" id='selfradio' value="self" name="training" autoComplete='off' className='training_booking'
                                    placeholder="Training Name"
                                />
                                <label htmlFor='selfradio'>Self</label>
                            </div>
                            <div className='Other-section' onClick={() => this.otherCategory()}>
                                <input type="radio" value="other" id='otherradio' name="training" autoComplete='off' className='training_booking'
                                    placeholder="Training Name"
                                />
                                <label htmlFor='otherradio'>Other</label>
                            </div>
                        </div>
                    </div>
                    {this.state.CategorySelected == true &&
                        <>

                            <div className="row">
                                <div className="col-md-3 required"><label>Training Name</label><span>*</span>
                                    <select className='form-control' id='training_names' onChange={() => this.GetSelectedTrainingDetails()}>
                                        <option>--Select--</option>
                                        {this.state.TrainingNames.map((item) => {
                                            return (
                                                <option value={item.Title}>{item.Title}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-3 required"><label>Employee Code</label><span>*</span>
                                    <input type="text" id="employee_code" autoComplete='off' className='form-control'
                                        placeholder="Employee Code"
                                    />
                                </div>
                                <div className="col-md-3 required"><label>Employee Name</label><span>*</span>
                                    <input type="text" id="employee_name" autoComplete='off' className='form-control'
                                        placeholder="Employee Name"
                                    />
                                </div>
                                <div className="col-md-3 required"><label>Email Address</label><span>*</span>
                                    <input type="text" id="email" autoComplete='off' className='form-control'
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                            <div className="row send-invite-btn-wrap">
                                <div className="send_button required"><div className="w-130 td-div send-invite"><button className="btn-wrap" onClick={() => this.saveFormDetails()}>Submit</button></div></div>
                            </div>
                        </>
                    }

                </div>

            </>
        );
    }
}
