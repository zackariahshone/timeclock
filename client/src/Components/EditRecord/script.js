import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { setHistoryBulk, studentHistory } from "../../app/StudentHistorySlice";
import { getDateFromMilli, getStudentHistory, toCapitalize } from "../Dashboard/helpers";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { convertMilitaryToStandard } from "../TimeClock/helper";
import { updateItem } from "../../globalUtils/requests";
import { getPreviousSunday } from "./helpers";
export const EditRecord = ({ record, list }) => {
    const { id, name } = record;
    const history = useSelector(studentHistory)
    const recordHistory = getStudentHistory(id, Object.values(history))[0]?.clockedInOutHistory
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const [recordChanges, setRecordChanges] = useState();
    const [show, setShow] = useState(false);
    const previousSunday = getPreviousSunday()
    console.log('line 17' ,list)
    if (recordHistory) {
        return (
            <Fragment>
                <Row>
                    {
                        daysOfWeek.map((day) => (
                            <Col>
                                {
                                    list.map((historyRecord, x) => {
                                        const { status, timeMilli, time, setBy } = historyRecord;
                                        const dayOfRecord = getDayOfWeekFromMillisecond(timeMilli);
                                        if (day == dayOfRecord && timeMilli > previousSunday) {
                                            return (
                                                <Fragment>
                                                    <Row key={`history_${x}`}>
                                                        <Card key={`card_${x}`}>
                                                            <Card.Body key={`card_body${x}`}>
                                                                <Card.Title key={`card_Title${x}`}>
                                                                    <Card.Text key={`card_text${x}`}>
                                                                        {getDayOfWeekFromMillisecond(timeMilli)}
                                                                    </Card.Text>
                                                                </Card.Title>
                                                                <Form.Group key={`formgroup_${x}`}>
                                                                    <Card.Text key={`card_1${x}`}>Clocked {toCapitalize(status)}</Card.Text>
                                                                </Form.Group>
                                                                <Form.Group key={`formcard_${x}`}>
                                                                    <input
                                                                        onBlur={(e) => { setRecordChanges({ ...recordChanges, date: e.target.value }) }}
                                                                        defaultValue={getDateFromMilli(timeMilli)}></input>
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <input
                                                                        onBlur={(e) => { setRecordChanges({ ...recordChanges, time: e.target.value }) }}
                                                                        defaultValue={convertMilitaryToStandard(time)}></input>
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <input
                                                                        onBlur={() => { setRecordChanges({ ...recordChanges, setBy }) }}
                                                                        defaultValue={setBy}></input>
                                                                </Form.Group>
                                                                <Card.Footer>
                                                                    <Row>
                                                                        <Col>
                                                                            <Button
                                                                                onClick={() => { updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges }, setHistoryBulk) }}
                                                                                variant="info">Save</Button>
                                                                        </Col>
                                                                        <Col>
                                                                            <Button variant="danger">Cancel</Button>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Footer>
                                                            </Card.Body>
                                                        </Card>
                                                    </Row>
                                                </Fragment>
                                            )
                                        }
                                    })}
                            </Col>
                        ))
                    }
                </Row>
            </Fragment>
        )
    }
}



function getDayOfWeekFromMillisecond(milliseconds) {
    const date = new Date(Number(milliseconds));
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
}

function getMilliFromDateAndTime(date, time) {
    return new Date(`${date} ${time}`)
}