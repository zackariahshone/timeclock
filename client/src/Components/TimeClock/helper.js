import React from "react";
import {
  Form,
  Card,
  Row,
  Col,
  InputGroup,
  Button,

} from "react-bootstrap";
import { getStudentHistory } from "../Dashboard/helpers";
import { useDispatch } from "react-redux";
import { timeClock } from "../../app/EmployeeListSlice";
import { createItem } from "../../globalUtils/requests";






export const CheckinCheckoutButtons = ({ student, studentHistory, currentUser, setStatusChange }) => {
  const dispatch = useDispatch();
  console.log(student);
return (
  <Card body>
  {studentHistory.map((doc) => {
    console.log(doc);
    
    return (
    <Form>
        <Row>
          <Col xs={2}>
            <text>{student.name}</text>
          </Col>
          <Col xs={2}>
            <text>{student.status}</text>
          </Col>
          <Col xs={4}>
            <InputGroup className="mb-3">
              <Form.Control onChange={() => { }} value={doc?.timeIn ? convertMilitaryToStandard(doc.timeIn) : ''} aria-label="First name" />
              <Form.Control onChange={() => { }} value={doc?.timeOut ? convertMilitaryToStandard(doc.timeOut) : ''} aria-label="Last name" />
            </InputGroup>
          </Col>
          {
            student.status == 'out' && (student.timeIn && student.timeOut) ?
              <Col>
                <p> {getHoursWorked(studentHistory?.timeinMilli, studentHistory?.timeOutMilli)} hrs</p>
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
    </Form>)
  })}
      </Card>
)
}

export function getHoursWorked(timein, timeout) {
  if (timein && timeout) {
    const clockedIn = timein
    const clockedOut = timeout
    return ((Number(clockedOut) - Number(clockedIn)) / (1000 * 60 * 60)).toFixed(2);
  }
  return null;
}


export function convertMilitaryToStandard(militaryTime) {
  if (militaryTime) {
    // Split the time string into hours and minutes
    const [hours, minutes] = militaryTime.split(":").map(Number);
    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    // Convert hours to 12-hour format
    const standardHours = hours % 12 || 12;
    // Format the standard time string
    const standardTime = `${standardHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return standardTime;
  }
  return '';
}

export function getLastTimeClockIn(history, studentid) {
  const lastCheck = getStudentHistory(studentid, Object.values(history))
  if (lastCheck.length > 0) {
    const lastDoc = lastCheck[0].clockedInOutHistory[lastCheck[0].clockedInOutHistory.length - 1]
    const secondToLastDoc = lastCheck[0].clockedInOutHistory[lastCheck[0].clockedInOutHistory.length - 2]
    let timeIn, timeinMilli, timeOutMilli, timeOut;
    timeOut = lastDoc.status == 'out' ? lastDoc.time : null;
    timeOutMilli = lastDoc.status == 'out' ? lastDoc.timeMilli : null;
    if (lastDoc.status == 'in') {
      timeIn = lastDoc.time
      timeinMilli = lastDoc.timeMilli
    } else {
      timeIn = secondToLastDoc.time
      timeinMilli = secondToLastDoc.timeMilli
    }
    return { timeIn, timeinMilli, timeOut, timeOutMilli }
  }
}

export function getstudentHistoryFromID(rawhisory, studentid) {
  return Object.values(rawhisory).filter(doc => doc.id == studentid)[0].clockedInOutHistory
}

export function getTodaysClockInHistory(history) {
  const now = new Date();
  const milliSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const todayCollection = [];
  let timeIn, timeinMilli, timeOutMilli, timeOut;
  history.forEach((record) => {
    if (milliSeconds < Number(record.timeMilli)) {
      if (record.status == 'in') {
        timeIn = record.time
        timeinMilli = record.timeMilli
      }
      else if (record.status == 'out') {
        timeOut = record.time
        timeOutMilli = record.timeMilli
        todayCollection.push({ timeIn, timeinMilli, timeOut, timeOutMilli })
      }
    }

  })
  return todayCollection;
}