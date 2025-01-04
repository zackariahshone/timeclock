import React, { Fragment, useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { addEmployeeBulk, students } from "../../app/EmployeeListSlice";
import { isAdmin, userObj, userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
import {
    getstudentHistoryFromID,
    getTodaysClockInHistory,
    CheckinCheckoutButtons
} from "./helper";
import { getData } from "../../globalUtils/requests"
import { setHistoryBulk, studentHistory } from "../../app/StudentHistorySlice";

export default (props) => {
    const admin = useSelector(isAdmin);
    const currentUser = useSelector(userSignedIn);
    const userObject = useSelector(userObj);
    const [statusChange, setStatusChange] = useState();
    const [program, setProgram] = useState(admin ? 'Aspire' : userObject.program);
    const studentList = program ? useSelector(students).filter((emp) => `${program}` in emp.programs) : useSelector(students)
    const history = useSelector(studentHistory);
    useEffect(() => {
        getData('/getstudenthistory', 'GET', setHistoryBulk);
        setStatusChange(false);
    }, [statusChange])
    return (

        <Fragment>
            <h1>Time Clock</h1>
            {
                admin ?
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
                    </ButtonGroup> :
                    <Button>{userObject.program}</Button>
            }

            <h3 className="titleMarginBottom">Students:</h3>
            {studentList.map((student) => {
                const todaysHistoryArray = getTodaysClockInHistory(getstudentHistoryFromID(history, student.id, program))
                return (
                    <Fragment>
                        <CheckinCheckoutButtons 
                            program={program}
                            student={student}
                            studentHistory={todaysHistoryArray}
                            currentUser={currentUser}
                            setStatusChange={setStatusChange} />
                    </Fragment>
                )
            })}
        </Fragment>
    )
}




