import React, { Fragment, useState } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
export default (props) => {
    const [selectedEmployee, setSelectedEmployee] = useState();
    const employeeList = useSelector((state) => state.employeeList.employees)
    let empCount = 0;
    return (
        <Fragment>

            <h1>Insight</h1>

            <Container className="marginBottom">
                <Row className="marginBottom">
                    <Col >
                        <Card>
                            <h3>Number of Clients</h3>
                            <p>{employeeList.length}</p>
                        </Card>
                    </Col>
                    <Col >
                        <Card>
                            <h3>Clients Clocked In</h3>
                            {employeeList.forEach(emp => {
                                if (emp.status == 'in') {
                                    empCount += 1;
                                }
                            })}
                            <p>{empCount}</p>
                        </Card>
                    </Col>
                </Row>
                <Row className="marginBottom">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card>
                            <h3>Percentage Of Employees Clocked In</h3>
                            <b>{Number(empCount / employeeList.length * 100).toFixed(2)}%</b>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <Row className="marginBottom">
                        <Col>
                            <h3 id='clockedIn'>Clocked In</h3>
                            {getEmployeeStatus('in', employeeList)?.map(emp => (
                                <p  
                                    onClick={() => { setSelectedEmployee(emp) }}
                                    className = {`employeeList ${selectedEmployee?.name == emp.name ? 'selected' :''}` }
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                        <Col>
                            <h3 id='clockedOut'>Clocked Out</h3>
                            {getEmployeeStatus('out', employeeList)?.map(emp => (
                                <p  className = {`employeeList ${selectedEmployee?.name == emp.name ? 'selected' :''}` }
                                    onClick={() => { setSelectedEmployee(emp) }}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                    </Row>
                </Card>
            </Container>
            <Container>

                <Card >
                    {selectedEmployee && selectedEmployee.history.length > 0 ?
                        <>
                            <h3>{selectedEmployee.name}</h3>
                            {selectedEmployee.history.map((date,i) => {
                                return (
                                    <Row className="marginBottom">
                                        <Col>
                                            <p>{Object.keys(date)[0]}</p>
                                        </Col>
                                        <Col>
                                            <Card>
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
                        : "No History To Display"}
                </Card>

            </Container>
        </Fragment>
    )
}

function getEmployeeStatus(status, employees) {
    switch (status) {
        case 'in':

            return employees.filter((employee) => (employee.status == 'in'));
        case 'out':

            return employees.filter((employee) => (employee.status == 'out'));
        default:
            return;
    }
}

function getTimeFromMillisecond(milliseconds) {
    if (milliseconds) {
        const date = new Date(Number(milliseconds))
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes}`;
    }
    return "On Clock";
}

function getHoursWorked(timeStamps){
    console.log(timeStamps);
    
    const dateKey = Object.keys(timeStamps)[0];

    const clockedIn = timeStamps[dateKey].in
    const clockedOut = timeStamps[dateKey].out  
      
    return (Number(clockedOut) - Number(clockedIn)) / (1000);
}