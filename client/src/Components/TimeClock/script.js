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
    CheckinCheckoutButtons
} from "./helper";
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
                const todaysHistoryArray = getTodaysClockInHistory(getstudentHistoryFromID(history, student.id))
                return (
                    <Fragment>
                        <CheckinCheckoutButtons student={student} studentHistory={todaysHistoryArray} currentUser={currentUser} setStatusChange={setStatusChange} />
                    </Fragment>
                )
            })}
        </Fragment>
    )
}




