import React, { Fragment, useState } from "react";
import { Col, Container, Row, Card, Button, CardTitle, Form } from "react-bootstrap";
import { useSelector } from 'react-redux';
import {
    displaySchoolInsights,
    toCapitalize,
    getStudentStatus,
    getTimeFromMillisecond,
    getHoursWorked,
    filterByPrograms
} from './helpers.js'
import './style.css';
import { students } from "../../app/EmployeeListSlice.js";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default (props) => {
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [showStatus, setShowStatus] = useState();
    const employeeList = useSelector(students)

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

                {selectedEmployee && selectedEmployee.history.length > 0 ?
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
                            <Button > EXPORT </Button>
                        </div>
                    </Container>
                            <h3>{selectedEmployee.name} : {toCapitalize(selectedEmployee.type)}</h3>
                            {selectedEmployee.history.map((date, i) => {
                                return (
                                    <Row className="marginBottom">
                                        <Col>
                                            <p>{Object.keys(date)[0]}</p>
                                        </Col>
                                        <Col>
                                            <Card className="alignRight marginRight">
                                                <p>Clocked In: {getTimeFromMillisecond(date[Object.keys(date)[0]].in)}</p>
                                                <p> Clocked Out: {getTimeFromMillisecond(date[Object.keys(date)[0]].out)}</p>
                                                <p>Total : {getHoursWorked(selectedEmployee.history[i])} </p>
                                                <p>Set By: {date[Object.keys(date)[0]].setBy}</p>
                                            </Card>
                                        </Col>
                                    </Row>
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