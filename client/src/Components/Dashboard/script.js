import React, { Fragment, useState } from "react";
import { Col, Container, Row, Card, CardTitle, Form } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import {
    displayStaffInsights,
    filterByType,
    toCapitalize,
    getEmployeeStatus,
    getTimeFromMillisecond,
    getHoursWorked
} from './helpers.js'
import './style.css';
export default (props) => {
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [showStatus, setShowStatus] = useState();
    const employeeList = useSelector((state) => state.employeeList.employees)

    return (
        <Fragment>

            <h1>Insight</h1>

            <Container className="marginBottom">

                {employeeList ? displayStaffInsights("contractor", filterByType("contractor", employeeList)) : ''}

                {employeeList ? displayStaffInsights("employee", filterByType("employee", employeeList)) : ''}
                <Card className={showStatus ? 'showStatus' : 'hideStatus'}>
                    <Row className="marginBottom">
                        <Col>
                            <h3 id='clockedIn'>Clocked In</h3>
                            {getEmployeeStatus('in', employeeList)?.map(emp => (
                                <p
                                    onClick={() => { setSelectedEmployee(emp) }}
                                    className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                        <Col>
                            <h3 id='clockedOut'>Clocked Out</h3>
                            {getEmployeeStatus('out', employeeList)?.map(emp => (
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
                    <Card >
                        <>
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
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                            })
                            }
                        </>
                    </Card>
                    : ''}

            </Container>
        </Fragment>
    )
}