import React, { Fragment, useState } from "react";
import {
    Col,
    Container,
    Dropdown,
    Form,
    InputGroup,
    Row,
    Button,
    Table
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { teachers } from "../../app/EmployeeListSlice";
import { Calendar } from "primereact/calendar";
import { getData } from "../../globalUtils/requests";
import { exportData, setExportData } from "../../app/ExportData";
import ExportCSV from '../Dashboard/helpers';
import './style.css'
const dropDowns = [{ "Programs": ['Aspire', "Richardson Industries"] }]
const ColumnHeaders = ['DateIn', 'DateOut', 'TimeIn', 'TimeOut', 'CheckedInBy', 'CheckedOutBy','StudentName','StudentId', 'TotalHours'];
export const Billing = () => {
    const [dates, setDates] = useState()
    const [filters, setFilters] = useState({});
    const dataForExport = useSelector(exportData);

    return (
        <Container>
            <h1>Billing</h1>
            <Container>
                <Row>
                    <Col xs={2}>
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                {filters?.program ? filters.program : 'Select a Program'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                onClick={(e) => {
                                    setFilters({ ...filters, 'program': e.target.textContent })
                                }}
                            >
                                <Dropdown.Item href="#/action-1">Aspire</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Richardson Industries</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                          <span> Date and Time Filter: <Calendar className="calendarFilter" value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection /></span>
                    </Col>
                    <Col>
                        <Button
                            onClick={() => {
                                const url = `/reports?start=${new Date(dates[0]).getTime()}&end=${new Date(dates[1]).getTime()}&building=${filters.program}`
                                getData(url, 'GET', setExportData)
                            }}
                            variant='info'> Submit Filters </Button>
                            
                            <ExportCSVReport style={{marginRight:'2%'}} data={dataForExport} fileName={`new file`} disable = {dataForExport?false:true}/>
                    </Col>
                </Row>
            </Container>
            {dataForExport != null ?
                <div className="previewData">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {/* {dataForExport[0].map((key) => { */}
                                {['DateIn', 'DateOut', 'TimeIn', 'TimeOut', 'CheckedInBy', 'CheckedOutBy','StudentName','StudentId', 'TotalHours'].map((key,x)=>{
                                    return (
                                         <th>{key}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataForExport.map((doc) => {
                                    const values = Object.values(doc);
                                    return (
                                        <tr>
                                            {['DateIn', 'DateOut', 'TimeIn', 'TimeOut', 'CheckedInBy', 'CheckedOutBy','StudentName','StudentId', 'Total'].map((index)=>{
                                                return <td>{doc[index]}</td>
                                            })}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                : ''
            }
        </Container>
    )
}

function ExportCSVReport ({ data, fileName,disable }) {
    
  const downloadCSV = () => {
    // Convert the data array into a CSV string  
        // DateIn	DateOut	TimeIn	TimeOut	CheckedInBy, CheckedOutBy	Total Hours

    const csvString = [
        data[0], // Specify your headers here
        ...data.map(item => [item.DateIn,item.DateOut, item.TimeIn, item.TimeOut, item.CheckedInBy ,item.CheckedOutBy,item.StudentName, item.StudentId, Math.floor(item.Total)]) // Map your data fields accordingly
    ]
    .map(row => row.join(","))
    .join("\n");
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <Button className="exportButton" variant={disable?'secondary':'success'} disabled={disable} onClick={downloadCSV}>Export CSV</Button>;
};

