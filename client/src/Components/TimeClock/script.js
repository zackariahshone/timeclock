import React, { useEffect, useState } from "react";
import { Col, Row, Button, Card, InputGroup, Form } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { timeClock } from "../../app/EmployeeListSlice";



export default (props) => {
    const [statusChange, setStatusChange] = useState();
    const employeeList = useSelector((state) => state.employeeList.employees)
    const dispatch = useDispatch();

    useEffect(() => {
        setStatusChange(false);
    }, [statusChange])
    return (
        employeeList.map((employee) => {
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
                        <Col>
                            <Button
                                onClick={() => {
                                    //todo create method to get time in correct format
                                    dispatch(timeClock({employee, time:`${new Date().getHours()}:${new Date().getMinutes()}`}));
                                    setStatusChange(true);
                                }}
                                variant={employee.status == "out" ? 'info' : 'danger'}>  {employee.status == "out" ? 'Check In' : 'Check Out'} </Button>
                        </Col>
                    </Row>
                </Card>
            )
        })
    )
}