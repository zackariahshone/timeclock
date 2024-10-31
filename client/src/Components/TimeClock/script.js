import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Button, Card, InputGroup, Form, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { timeClock, students } from "../../app/EmployeeListSlice";
import { userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
import { convertMilitaryToStandard } from "./helper";
import {createItem} from "../../globalUtils/requests"

export default (props) => {
    const [statusChange, setStatusChange] = useState();
    const [program, setProgram] = useState('');
    const studentList = program ? useSelector(students).filter((emp) => emp.program == program) : useSelector(students)
    const currentUser = useSelector(userSignedIn);
    const dispatch = useDispatch();
    useEffect(() => {
        setStatusChange(false);
    }, [statusChange])
    return (

        <Fragment>
            <h1>Time Clock</h1>
            <ButtonGroup aria-label="Basic example">
                <Button
                    variant={program == 'Aspire' ? 'info' : 'secondary'}
                    onClick={() => {
                        setProgram('Aspire')
                    }}>
                    Aspire</Button>
                <Button
                    onClick={() => {
                        setProgram('Richardson Industries')
                    }}
                    variant={program == 'Richardson Industries' ? 'info' : 'secondary'}>
                    Richardson Industries</Button>
                <Button
                    onClick={() => {
                        setProgram('')
                    }}
                    variant={program == '' ? 'info' : 'secondary'}
                >All</Button>
            </ButtonGroup>

            <h3 className="titleMarginBottom">Students:</h3>
            {studentList.map((student) => {
                return (
                    <Form>
                        <Card body>
                            <Row>
                                <Col xs={2}>
                                    <text>{student.name}</text>
                                </Col>
                                <Col xs={2}>
                                    <text>{student.status}</text>
                                </Col>
                                <Col xs={4}>
                                    <InputGroup className="mb-3">
                                        <Form.Control value={student.timeIn ? convertMilitaryToStandard(student.timeIn) : ''}  aria-label="First name" />
                                        <Form.Control value={student.timeOut ? convertMilitaryToStandard(student.timeOut) : ''}  aria-label="Last name" />
                                    </InputGroup>
                                </Col>
                                {
                                    student.status == 'out' && (student.timeIn && student.timeOut) ?
                                        <Col>
                                            {console.log(student.history[student.history.length - 1])}
                                            <p> {getHoursWorked(student.history[student.history.length - 1])} hrs</p>
                                        </Col>
                                        : <Col></Col>
                                }
                                <Col>
                                    <Button
                                        onClick={() => {
                                            const timeClockData = {
                                                    student,
                                                    time: `${new Date().getHours()}:${new Date().getMinutes()}`,
                                                    timeMilli: `${new Date().getTime()}`,
                                                    setBy:currentUser
                                                }
                                            createItem('/studenttimeclock',timeClockData,timeClock);
                                            setStatusChange(true);
                                        }}
                                        variant={student.status == "out" ? 'info' : 'danger'}>  {student.status == "out" ? 'Check In' : 'Check Out'} </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                )
            })}
        </Fragment>
    )
}

function getHoursWorked(timeStamps) {
    const dateKey = Object.keys(timeStamps)[0];
    const clockedIn = timeStamps[dateKey].in
    const clockedOut = timeStamps[dateKey].out
    return ((Number(clockedOut) - Number(clockedIn)) / (1000 * 60 * 60)).toFixed(2);
}