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
import "DataTables.net";
import 'datatables.net-dt/css/jquery.dataTables.css';
import * as $ from "jquery";


SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/style.css?v=2.9');
SPComponentLoader.loadCss('https://remodigital.sharepoint.com/:f:/r/sites/Remo/RemoSolutions/VTM/SiteAssets/Visitor%20and%20Trainee%20Assets/css/responsivestyle.css?v=2.9');

var NewWeb: any;

export interface FormState {
    tableItems: any[];
}

export default class VisitorDetails extends React.Component<IVisitorProps, FormState, {}> {
    public constructor(props: IVisitorProps, state: FormState) {
        super(props);
        this.state = {
            tableItems: []
        }
        NewWeb = Web("" + this.props.siteurl + "")

    }
    public componentDidMount() {
        this.GetVisitorDetails()
    }
    public GetVisitorDetails() {
        NewWeb.lists.getByTitle("Visitor Transaction").items.select("*").expand('AttachmentFiles').get()
            .then((items: any) => {
                if (items.length != 0) {
                    console.log(items)
                    this.setState({
                        tableItems: items
                    })
                }
            }).then(() => {
                this.LoadTableDatas()
            });
    }
    public LoadTableDatas() {
        $(".ilter-hide").show();
        $.fn.dataTable.ext.errMode = 'none';
        ($('#table-example') as any).DataTable({
            pageLength: 10,
            bSort: false,
            lengthMenu: [[5, 10, 20, 50, 100, -1], [5, 10, 20, 50, 100, "All"]],
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;
                    var select = $('<select class="form-control"><option value="">All</option></select>')
                        .appendTo($(column.header()).empty()).on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                ($(this) as any).val()
                            );
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });
                    column.data().unique().sort().each(function (d: any, j: any) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    });
                });
            },
        });

    }

    public render(): React.ReactElement<IVisitorProps> {
        const TableDetails: JSX.Element[] = this.state.tableItems.map(function (item: any, key: any) {
            return (

                <tr>
                    <td>{key + 1}</td>
                    <td>{item.Title}</td>
                    <td>{item.MobileNumber}</td>
                    <td>{item.EmiratesID}</td>
                    <td>{item.CompanyName == true ? "Template 1" : "Template 2"}</td>
                    <td>{item.InTime}</td>
                    <td>{item.MeetingPerson}</td>
                    {item.AttachmentFiles.length != 0 ?
                        <td>{item.AttachmentFiles.map((data: any) => {
                            return (
                                <a href={data.ServerRelativeUrl} target='blank'>{data.FileName}</a>
                            )
                        })}</td> :
                        <td>-</td>
                    }
                </tr>
            );

        });

        return (
            <>
                <div className="manual-booking-table view-event-table" style={{ display: "block" }}>
                    <div className="table-responsive" id="table-content">
                        <table className="table" id="table-example">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Mobile Number</th>
                                    <th>Emirates ID</th>
                                    <th>Company Name</th>
                                    <th>In Time</th>
                                    <th>Meeting Person</th>
                                    <th>Photo</th>
                                </tr>
                            </thead>
                            <thead>

                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Mobile Number</th>
                                    <th>Emirates ID</th>
                                    <th>Company Name</th>
                                    <th>In Time</th>
                                    <th>Meeting Person</th>
                                    <th>Photo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TableDetails}
                            </tbody>

                        </table>

                    </div>
                </div>

            </>
        );
    }
}
