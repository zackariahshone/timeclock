import React, { Fragment, useState } from "react";
import { Col, Container, Row, Card, Button, CardTitle, Form } from "react-bootstrap";
import { useSelector } from 'react-redux';
import ExportCSV, {
    displaySchoolInsights,
    toCapitalize,
    getStudentStatus,
    getTimeFromMillisecond,
    getHoursWorked,
    filterByPrograms,
    getStudentHistory,
    getDateFromMilli
} from './helpers.js'
import { studentHistory } from "../../app/StudentHistorySlice.js";
import './style.css';
import { students } from "../../app/EmployeeListSlice.js";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
export default (props) => {
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [showStatus, setShowStatus] = useState();
    const employeeList = useSelector(students)
    const history = useSelector(studentHistory)
    const selectedHistory = getStudentHistory(selectedEmployee?.id, Object.values(history));
    let x,y;
    return (
        <Fragment>

            <h1>Insight</h1>

            <Container className="marginBottom">

                {employeeList ? displaySchoolInsights("aspire", filterByPrograms('aspire', employeeList)) : ''}
                {employeeList ? displaySchoolInsights("richardson industries", filterByPrograms('richardson industries', employeeList)) : ''}
               
                <Card className={showStatus ? 'showStatus' : 'hideStatus'}>
                    <Row className="marginBottom">
                        <Col>
                            <h3 id='clockedIn'>Clocked In</h3>
                            {getStudentStatus('in', employeeList)?.map(emp => (
                                <p
                                    onClick={() => { setSelectedEmployee(emp) }}
                                    className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                        <Col>
                            <h3 id='clockedOut'>Clocked Out</h3>
                            {getStudentStatus('out', employeeList)?.map(emp => (
                                <p className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                    onClick={() => { setSelectedEmployee(emp) }}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                    </Row>
                </Card>
            </Container>

            

            <Container >

                {selectedEmployee &&  getStudentHistory(selectedEmployee.id,Object.values(history))[0]?.clockedInOutHistory ? 
                    <>

                    <Card >
                        <>
                    <Container className="marginTop">
                        <DateRangePicker 
                            onChange={(e)=>{
                                console.log(e)
                            }}
                        />
                        <div className="export">
                            <ExportCSV data={[]} fileName={'newfile'}/>
                        </div>
                    </Container>
                            <h3>{selectedEmployee.name} : {toCapitalize(selectedEmployee.type)}</h3>
                            {
        
                                getStudentHistory(selectedEmployee?.id, Object.values(history))[0].clockedInOutHistory.map((history, i) => {
                              
                                if(history.status == 'in'){
                                    x = history.timeMilli
                                }else{
                                    y=history.timeMilli
                                }
                                return (
                                    <>
                                    <Row className="marginBottom">
                                        <Col>
                                            {getDateFromMilli(history.timeMilli)}
                                        </Col>
                                        <Col>
                                            <Card className="alignRight marginRight">
                                                <p>Clocked {toCapitalize(history.status)}: {getTimeFromMillisecond(history.timeMilli)}</p>
                                                <p>Set By: {history.setBy}</p>
                                            </Card>
                                        {
                                            history.status == 'out' ?  
                                                    <text>TOTAL hours here {getHoursWorked(x,y)}</text>
                                            :''
                                        }
                                        </Col>
                                    </Row>
                                    </>
                                )
                            })
                            }
                        </>
                    </Card>
                    </>
                    : ''}

            </Container>
        </Fragment>
    )
}