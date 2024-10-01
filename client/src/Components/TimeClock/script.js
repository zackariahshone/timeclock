import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Button, Card, InputGroup, Form, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { timeClock } from "../../app/EmployeeListSlice";



export default (props) => {
    const [statusChange, setStatusChange] = useState();
    const [building, setBuilding] = useState();
    const employeeList = building ? useSelector((state) => state.employeeList.employees).filter((emp) => emp.buildingName == building) : useSelector((state) => state.employeeList.employees)
    const dispatch = useDispatch();
    useEffect(() => {
        setStatusChange(false);
    }, [statusChange])
    return (

        <Fragment>
            <ButtonGroup aria-label="Basic example">
                <Button
                    variant={building == 'house1' ? 'info' : 'secondary'}
                    onClick={() => {
                        setBuilding('house1')
                    }}>
                    House1</Button>
                <Button
                    onClick={() => {
                        setBuilding('house2')
                    }}
                    variant={building == 'house2' ? 'info' : 'secondary'}>
                    House 2</Button>
            </ButtonGroup>


            {employeeList.map((employee) => {
                return (

                    <Card body>
                        <Row>
                            <Col xs={2}>
                                <text>{employee.name}</text>
                            </Col>
                            <Col xs={2}>
                                <text>{employee.status}</text>
                            </Col>
                            <Col xs={4}>
                                <InputGroup className="mb-3">
                                    <Form.Control value={employee.timeIn ? employee.timeIn : ''} aria-label="First name" />
                                    <Form.Control value={employee.timeOut ? employee.timeOut : ''} aria-label="Last name" />
                                </InputGroup>
                            </Col>
                            {
                                employee.status == 'out' && (employee.timeIn && employee.timeOut) ? 
                                <Col>
                                    {console.log(employee.history[employee.history.length - 1])}
                                   <p> {getHoursWorked(employee.history[employee.history.length - 1])}</p>
                                </Col>
                                :<Col></Col>
                                
                            }
                            <Col>
                                <Button
                                    onClick={() => {
                                        //todo create method to get time in correct format
                                        dispatch(timeClock(
                                            {
                                                employee,
                                                time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                                                timeMilli: `${new Date().getTime()}`
                                            }
                                        ));
                                        setStatusChange(true);
                                    }}
                                    variant={employee.status == "out" ? 'info' : 'danger'}>  {employee.status == "out" ? 'Check In' : 'Check Out'} </Button>
                            </Col>
                        </Row>
                    </Card>
                )
            })}
        </Fragment>
    )
}

function getHoursWorked(timeStamps){
    const dateKey = Object.keys(timeStamps)[0];

    const clockedIn = timeStamps[dateKey].in
    const clockedOut = timeStamps[dateKey].out

    console.log(clockedOut, clockedIn);
    
    return (Number(clockedOut) - Number(clockedIn)) / (1000);
}