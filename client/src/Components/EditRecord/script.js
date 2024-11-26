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

    const previousSunday = getPreviousSunday()
    const weeklyList = list.filter((doc) => doc.timeMilli > previousSunday)
    if (recordHistory) {
        return (
            <Fragment>
                <Row>
                    {
                        daysOfWeek.map((day) => {
                            {/* dayNotSet = true */}
                            return (
                                <Col>
                                    {

                                        weeklyList.map((historyRecord, x) => {
                                            const { status, timeMilli, time, setBy } = historyRecord;
                                            const dayOfRecord = getDayOfWeekFromMillisecond(timeMilli);
                                            if (dayOfRecord == day) {
                                                return (
                                                    <Fragment>
                                                        <Row key={`history_${x}`}>
                                                            <HourEditCard 
                                                                timeMilli={timeMilli} 
                                                                status={status} 
                                                                time={time} 
                                                                setBy={setBy} 
                                                                weeklyList={weeklyList} 
                                                                x={x} 
                                                                list={list} />
                                                        </Row>
                                                    </Fragment>
                                                )
                                            }
                                        })}
                                </Col>
                            )
                        })
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

function HourEditCard({ timeMilli, status, time, setBy, weeklyList, x }) {
    const [recordChanges, setRecordChanges] = useState();
    const [error, setError] = useState();
    console.log(`${x}`);
    
    return (
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
                        {/* <Col>{!error ? {error}:''}</Col> */}
                        <Col >
                            <Button 
                                disabled={!recordChanges}
                                onClick={() => {
                                    const millisecondChange = new Date(`${recordChanges.date} ${recordChanges.time}`).getTime();
                                    console.log()
                                    console.log(millisecondChange > Number(weeklyList[x-1].timeMilli))
                                    if (weeklyList[x].status == 'in' && millisecondChange > Number(weeklyList[x-1].timeMilli)) {
                                        console.log(weeklyList[x-1].status);
                                        console.log('changes', recordChanges)
                                        console.log(weeklyList[x-1])
                                        //check vs previous out time and and next out time if it exists
                                        console.log('record time to validate', new Date(`${recordChanges.date} ${recordChanges.time}`).getTime())
                                        // updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges }, setHistoryBulk) 
                                    } else if (weeklyList[x].status == 'out') {
                                        console.log(weeklyList[x].status);
                                        console.log('changes', recordChanges)
                                        console.log(weeklyList[--x])
                                        //check vs last time in and next time in if avaialable
                                        console.log('record time to validate', new Date(`${recordChanges.date} ${recordChanges.time}`).getTime())
                                        // updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges }, setHistoryBulk) 
                                    }else{
                                        setError('Input Out of Bounds');
                                    }
                                    // updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges }, setHistoryBulk) 
                                }}
                                variant="info">Save</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}