import React, { Fragment, useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { students } from "../../app/EmployeeListSlice";
import { isAdmin, userObj, userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
import {
    getstudentHistoryFromID,
    getTodaysClockInHistory,
    CheckinCheckoutButtons
} from "./helper";
import { getData, updateItem } from "../../globalUtils/requests"
import { setHistoryBulk, studentHistory } from "../../app/StudentHistorySlice";
import { BulkCheckin } from "../BulkCheckIn/script";

export default (props) => {
    const admin = useSelector(isAdmin);
    const currentUser = useSelector(userSignedIn);
    const userObject = useSelector(userObj);
    const [statusChange, setStatusChange] = useState();
    const [program, setProgram] = useState(admin ? 'Aspire' : userObject.program);
    const [showBulkCheckin, setShowBulkCheckin] = useState();
    const studentList = program ? useSelector(students).filter((emp) => `${program}` in emp.programs) : useSelector(students)
    const history = useSelector(studentHistory);
    useEffect(() => {
        getData('/getstudenthistory', 'GET', setHistoryBulk);
        setStatusChange(false);
    }, [statusChange])
    return (

        <Fragment>
            <h1>Time Clock</h1>
            <ButtonGroup aria-label="Basic example">
                {
                    admin ?
                        <>
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
                        </>
                        :
                        <Button>{userObject.program}</Button>
                }
            </ButtonGroup>
            <h3 className="titleMarginBottom">Students:</h3><span>
                <div className="titleMarginBottom">
                    {
                        <Button
                            variant="info"
                            onClick={() => {
                                setShowBulkCheckin(true)
                            }}>
                            Bulk Checkin/Checkout
                        </Button>
                    }
                </div>
            </span>
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
            {showBulkCheckin ? <BulkCheckin show={showBulkCheckin} setShow={setShowBulkCheckin} studentList={studentList} program={program} /> : <></>}
        </Fragment>
    )
}




