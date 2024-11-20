import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Button, Card, InputGroup, Form, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { timeClock, students } from "../../app/EmployeeListSlice";
import { userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
import { 
    convertMilitaryToStandard, 
    getHoursWorked,
    getstudentHistoryFromID,
    getLastTimeClockIn,
    getTodaysClockInHistory, 
    CheckinCheckoutButtons} from "./helper";
import { createItem, getData } from "../../globalUtils/requests"
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
        getData('/getstudenthistory', 'GET', setHistoryBulk);
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
                {/* {getTodaysClockInHistory(getstudentHistoryFromID(history,student.id))} */}
                const currentStudentHistory = getLastTimeClockIn(history, student.id)
                return (
                    <>
                    {getTodaysClockInHistory(getstudentHistoryFromID(history,student.id)).length > 0 ?
                        <CheckinCheckoutButtons student={student} studentHistory={getTodaysClockInHistory(getstudentHistoryFromID(history,student.id))} currentUser={currentUser} setStatusChange={setStatusChange} />
                        :  
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
                                        <Form.Control onChange={()=>{}} value={currentStudentHistory?.timeIn ? convertMilitaryToStandard(currentStudentHistory.timeIn) : ''} aria-label="First name" />
                                        <Form.Control onChange={()=>{}} value={currentStudentHistory?.timeOut ? convertMilitaryToStandard(currentStudentHistory.timeOut) : ''} aria-label="Last name" />
                                    </InputGroup>
                                </Col>
                                {
                                    student.status == 'out' && (student.timeIn && student.timeOut) ?
                                        <Col>
                                            <p> {getHoursWorked(currentStudentHistory?.timeinMilli, currentStudentHistory?.timeOutMilli)} hrs</p>
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
                                                setBy: currentUser
                                            }
                                            createItem('/studenttimeclock', timeClockData);
                                            dispatch(timeClock(timeClockData));
                                            setStatusChange(true);
                                        }}
                                        variant={student.status == "out" ? 'info' : 'danger'}>  {student.status == "out" ? 'Check In' : 'Check Out'} </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                    }
                    </>
                )
            })}
        </Fragment>
    )
}




