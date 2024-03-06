import * as React from 'react';
// import styles from './Visitor.module.scss';
import type { IVisitorProps } from './IVisitorProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
// import * as $ from "jquery";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/attachments";
import "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import swal from "sweetalert";
import * as moment from "moment";
import * as $ from "jquery";


SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;

export interface FormState {

}

export default class VisitorEntry extends React.Component<IVisitorProps, FormState, {}> {
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {

        }
        NewWeb = Web("" + this.props.siteurl + "")

    }
    public componentDidMount() {

    }
    public saveFormDetails() {
        NewWeb.lists.getByTitle("Visitor Transaction").items.add({
            Title: $("#name").val(),
            MobileNumber: $("#mobile_number").val(),
            EmiratesID: $("#emirates_id").val(),
            CompanyName: $("#company_name").val(),
            InTime: $("#in_time").val(),
            MeetingPerson: $("#meeting_person").val(),
            RequestID: "VISITOR-" + moment().format("DDMMYYYYHHmmss")
        }).then((item: any) => {
            var fileInput: any = $("#photo")
            var selectedFile: any = fileInput[0].files[0];
            console.log(selectedFile)
            let ID = item.data.Id;
            NewWeb.lists.getByTitle("Visitor Transaction").items.getById(ID).attachmentFiles.add(selectedFile.name, selectedFile).then(() => {
                swal({
                    text: "Submitted successfully!",
                    icon: "success",
                }).then(() => {
                    location.reload();
                })
            })

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
                <div className="add-event-page">
                    <div className="row">
                        <div className="col-md-3 required"><label htmlFor="fname">Mobile Number</label><span>*</span>
                            <input type="text" id="mobile_number" autoComplete='off' className='form-control'
                                placeholder="Mobile Number"
                            />
                        </div>
                        <div className="col-md-3 required"><label htmlFor="fname">Name</label><span>*</span>
                            <input type="text" id="name" autoComplete='off' className='form-control'
                                placeholder="Name"
                            />
                        </div>
                        <div className="col-md-3 required"><label htmlFor="fname">Emirates ID</label><span>*</span>
                            <input type="text" id="emirates_id" autoComplete='off' className='form-control'
                                placeholder="Emirates ID"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 required"><label htmlFor="fname">Company Name</label><span>*</span>
                            <input type="text" id="company_name" autoComplete='off' className='form-control'
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="col-md-3 required"><label htmlFor="fname">In Time</label><span>*</span>
                            <input type="text" id="in_time" autoComplete='off' className='form-control'
                                placeholder="In Time"
                            />
                        </div>
                        <div className="col-md-3 required"><label htmlFor="fname">Meeting Person</label><span>*</span>
                            <input type="text" id="meeting_person" autoComplete='off' className='form-control'
                                placeholder="Meeting Person"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 required"><label htmlFor="fname">Photo</label><span>*</span>
                            <input type="file" id="photo" autoComplete='off' className='form-control'
                                placeholder="photo"
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
