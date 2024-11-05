import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Button, Card, InputGroup, Form, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { timeClock, students } from "../../app/EmployeeListSlice";
import { userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
import { convertMilitaryToStandard } from "./helper";
import {createItem, getData} from "../../globalUtils/requests"
import { addStudentHistory, setHistoryBulk, studentHistory } from "../../app/StudentHistorySlice";
import { getStudentHistory } from "../Dashboard/helpers";

export default (props) => {
    const [statusChange, setStatusChange] = useState();
    const [program, setProgram] = useState('');
    const studentList = program ? useSelector(students).filter((emp) => emp.program == program) : useSelector(students)
    const currentUser = useSelector(userSignedIn);
    const history = useSelector(studentHistory);
    const dispatch = useDispatch();
    useEffect(() => {
        getData('/getstudenthistory','GET', setHistoryBulk);
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
                const currentStudentHistory = getLastTimeClockIn(history,student.id)
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
                                        <Form.Control value={currentStudentHistory?.timeIn ? convertMilitaryToStandard(currentStudentHistory.timeIn) : ''}  aria-label="First name" />
                                        <Form.Control value={currentStudentHistory?.timeOut ?convertMilitaryToStandard(currentStudentHistory.timeOut) : ''}  aria-label="Last name" />
                                    </InputGroup>
                                </Col>
                                {
                                    student.status == 'out' && (student.timeIn && student.timeOut) ?
                                        <Col>
                                            {/* {console.log(student.history[student.history.length - 1],'student.history log')} */}
                                            <p> {getHoursWorked(currentStudentHistory?.timeinMilli,currentStudentHistory?.timeOutMilli)} hrs</p>
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
                                            createItem('/studenttimeclock',timeClockData);
                                            dispatch(timeClock(timeClockData));
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

function getHoursWorked(timein, timeout) {
    if(timein && timeout){
        const clockedIn = timein
        const clockedOut = timeout
        return ((Number(clockedOut) - Number(clockedIn)) / (1000 * 60 * 60)).toFixed(2);
    }
    return null;
}

function getLastTimeClockIn(history, studentid){
    const lastCheck = getStudentHistory(studentid, Object.values(history))
    console.log(lastCheck)
    if(lastCheck.length > 0){
        const lastDoc = lastCheck[0].clockedInOutHistory[lastCheck[0].clockedInOutHistory.length - 1] 
        const secondToLastDoc = lastCheck[0].clockedInOutHistory[lastCheck[0].clockedInOutHistory.length - 2]
        let timeIn,timeinMilli,timeOutMilli,timeOut;    
        timeOut = lastDoc.status == 'out' ? lastDoc.time: null;
        timeOutMilli = lastDoc.status == 'out' ? lastDoc.timeMilli: null;
        if(lastDoc.status == 'in'){
            timeIn = lastDoc.time
            timeinMilli = lastDoc.timeMilli
        }else{
            timeIn = secondToLastDoc.time
            timeinMilli = secondToLastDoc.timeMilli
        }
        return {timeIn,timeinMilli,timeOut,timeOutMilli}
    }
}
