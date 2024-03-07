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
import Webcam from "react-webcam";

SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;

export interface FormState {
    webcamRef: any;
    isWebcamActive: boolean;
    capturedPhoto: string;
    UserAlreadyExists: boolean;
    AttachmentCopies: any[];
    PhotoName: string;
    ExistingVisitorID: number;
}

export default class VisitorEntry extends React.Component<IVisitorProps, FormState, {}> {
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {
            webcamRef: React.createRef(),
            isWebcamActive: false,
            capturedPhoto: "",
            UserAlreadyExists: false,
            AttachmentCopies: [],
            PhotoName: "",
            ExistingVisitorID: 0
        }
        NewWeb = Web("" + this.props.siteurl + "")
        this.handleSnapClick = this.handleSnapClick.bind(this);
    }
    public componentDidMount() {

    }
    public async saveFormDetails() {
        var Date = $("#in_time").val()
        var FormatDate = moment(Date).format('DD-MM-YYYY hh:mm A')
        let photoBlob: any;
        if (this.state.UserAlreadyExists == false) {
            photoBlob = this.dataURItoBlob(this.state.capturedPhoto);
        }
        NewWeb.lists.getByTitle("Visitor User Transaction").items.add({
            Title: $("#name").val(),
            MobileNumber: $("#mobile_number").val(),
            EmiratesID: $("#emirates_id").val(),
            CompanyName: $("#company_name").val(),
            InTime: FormatDate,
            MeetingPerson: $("#meeting_person").val(),
            RequestID: "VISITOR-" + moment().format("DDMMYYYYHHmmss"),
            IsFirstTime: this.state.UserAlreadyExists == false ? true : false,
            PhotoName: this.state.PhotoName,
            PhotoURL: this.state.UserAlreadyExists == false ? "" : this.state.capturedPhoto
        }).then((item: any) => {
            let ID = item.data.Id;
            var Filename = $("#name").val() + ".jpg"
            if (this.state.UserAlreadyExists == false) {
                NewWeb.lists.getByTitle("Visitor User Transaction").items.getById(ID).attachmentFiles.add(Filename, photoBlob)

                NewWeb.lists.getByTitle("Visitor Master Transaction").items.add({
                    Title: $("#name").val(),
                    MobileNumber: $("#mobile_number").val(),
                    EmiratesID: $("#emirates_id").val(),
                    CompanyName: $("#company_name").val(),
                    RequestID: "VISITOR-" + moment().format("DDMMYYYYHHmmss")
                }).then((item: any) => {
                    let ID = item.data.Id;
                    if (this.state.capturedPhoto != "") {
                        NewWeb.lists.getByTitle("Visitor Master Transaction").items.getById(ID).attachmentFiles.add(Filename, photoBlob)
                    }
                })
            } else {
                NewWeb.lists.getByTitle("Visitor Master Transaction").items.getById(this.state.ExistingVisitorID).update({
                    Title: $("#name").val(),
                    MobileNumber: $("#mobile_number").val(),
                    EmiratesID: $("#emirates_id").val(),
                    CompanyName: $("#company_name").val(),
                })
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
    public GetVisitorDetails() {
        var Number = $("#mobile_number").val()
        NewWeb.lists.getByTitle("Visitor Master Transaction").items.select("*").filter(`MobileNumber eq '${Number}'`).expand('AttachmentFiles').get()
            .then((items: any) => {
                if (items.length != 0) {
                    console.log("userDate", items)
                    swal({
                        text: "User already exists!",
                        icon: "warning",
                    }).then(() => {
                        $("#name").val(items[0].Title)
                        $("#emirates_id").val(items[0].EmiratesID)
                        $("#company_name").val(items[0].CompanyName)
                        // this.GetAttachmentContent(items[0].ID)
                        this.setState({
                            UserAlreadyExists: true,
                            PhotoName: items[0].AttachmentFiles[0].FileName,
                            capturedPhoto: items[0].AttachmentFiles[0].ServerRelativeUrl,
                            ExistingVisitorID: items[0].ID
                        })
                    })

                } else {
                    $("#name").val("")
                    $("#emirates_id").val("")
                    $("#company_name").val("")
                    this.setState({
                        UserAlreadyExists: false,
                        capturedPhoto: "",
                        PhotoName: "",
                        ExistingVisitorID: 0
                    })
                }
            })
    }
    // private async GetAttachmentContent(sourceItemId: number) {
    //     var Files = []
    //     try {
    //         // Get attachments from the source list item
    //         const sourceListAttachments = await NewWeb.lists.getByTitle("Visitor Master Transaction").items.getById(sourceItemId).attachmentFiles.get();
    //         console.log(sourceListAttachments);

    //         // Transfer attachments to another list
    //         for (const attachment of sourceListAttachments) {
    //             // Get the content of each attachment
    //             const attachmentFile = await NewWeb.getFileByServerRelativeUrl(attachment.ServerRelativeUrl);
    //             const attachmentContent = await attachmentFile.getBlob().then((file: any) => {
    //                 console.log("File", file)
    //             });
    //             console.log(attachmentContent);
    //             Files.push({
    //                 name: "User_photo.jpg",
    //                 content: attachmentContent
    //             });
    //             this
    //         }
    //         this.setState({
    //             AttachmentCopies: Files
    //         })

    //         console.log("Attachments transferred successfully to the destination list");
    //     } catch (error) {
    //         console.error("Error transferring attachments", error);
    //     }
    // }
    private handleSnapClick() {
        const photoDataUrl = this.state.webcamRef.current.getScreenshot();
        this.setState({
            isWebcamActive: false,
            capturedPhoto: photoDataUrl,
        });
        console.log(photoDataUrl)
    };
    public dataURItoBlob(dataURI: string) {
        const byteString = atob(dataURI.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: "image/jpeg" });
    }
    public render(): React.ReactElement<IVisitorProps> {
        // const {
        //   description,
        //   isDarkTheme,
        //   environmentMessage,
        //   hasTeamsContext,
        //   userDisplayName
        // } = this.props;
        const { isWebcamActive } = this.state;
        return (
            <>
                <div className="add-event-page">
                    <div className="row">
                        <div className="col-md-3 required"><label htmlFor="fname">Mobile Number</label><span>*</span>
                            <input type="text" onChange={() => this.GetVisitorDetails()} id="mobile_number" autoComplete='off' className='form-control'
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
                            <input type="datetime-local" id="in_time" autoComplete='off' className='form-control'
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
                            {/* {this.state.UserAlreadyExists === false && (
                                <> */}
                            {this.state.isWebcamActive ? (
                                <Webcam
                                    audio={false}
                                    ref={this.state.webcamRef}
                                    screenshotFormat="image/jpeg"
                                />
                            ) : (
                                <>
                                    {this.state.capturedPhoto ? (
                                        <img
                                            src={this.state.capturedPhoto}
                                            alt="Captured"
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                    ) : (
                                        <button onClick={() => this.setState({ isWebcamActive: true })}>
                                            Take Photo
                                        </button>
                                    )}
                                </>
                            )}
                            {/* </>
                            )} */}
                            {/* {this.state.UserAlreadyExists == true &&
                                <a href={capturedPhoto} target='_blank'>{PhotoName}</a>
                                } */}

                            {isWebcamActive && (
                                <button onClick={this.handleSnapClick}>Click Snap</button>
                            )}
                        </div>

                    </div>
                    <div className="row send-invite-btn-wrap">
                        <div className="send_button required"><div className="w-130 td-div send-invite"><button className="btn-wrap" onClick={() => this.saveFormDetails()}>Submit</button></div></div>
                    </div>
                </div >


            </>
        );
    }
}
