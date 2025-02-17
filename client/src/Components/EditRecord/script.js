import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setHistoryBulk, studentHistory } from "../../app/StudentHistorySlice";
import { getDateFromMilli, getStudentHistory, toCapitalize } from "../Dashboard/helpers";
import {
    Button,
    Card,
    Col,
    Form,
    InputGroup,
    Row,
    Dropdown

} from "react-bootstrap";
import { convertMilitaryToStandard } from "../TimeClock/helper";
import { updateItem } from "../../globalUtils/requests";
import { getPreviousSunday } from "./helpers";
import { isAdmin, userSignedIn } from "../../app/CurrentUserSlice";
import './style.css'
export const EditRecord = ({ record, list, program }) => {
    const { id } = record;
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const previousSunday = getPreviousSunday()
    let weeklyList = list.filter((doc) => doc.timeMilli > previousSunday)
    const weekdaysWithData = (weeklyList) =>{
        let daysWithData = [] 
        weeklyList.forEach((data)=>{
            if(!(daysWithData.includes(getDayOfWeekFromMillisecond(data.timeMilli)))){
                daysWithData.push(getDayOfWeekFromMillisecond(data.timeMilli))
            }
            
        })
        return daysWithData
    }
    weekdaysWithData(weeklyList);
    return (
        <Fragment>
            <div className="flex-container">
                {
                    daysOfWeek.map((day) => {
                        let noDataSet = false;
                        return (
                            <div className="dayDetails">
                                <h1>{day}</h1>
                                {
                                   
                                    weeklyList.map((historyRecord, x) => {
                                        const daysWithData = weekdaysWithData(weeklyList)
                                        const { status, timeMilli, time, setBy } = historyRecord;
                                        const dayOfRecord = getDayOfWeekFromMillisecond(timeMilli);
                                        if (dayOfRecord == day) {
                                            return (
                                                <Fragment>
                                                    <Row key={`history_${x}`}>
                                                        <HourEditCard
                                                            editedby={historyRecord?.editedby}
                                                            timeMilli={timeMilli}
                                                            status={status}
                                                            time={time}
                                                            setBy={setBy}
                                                            weeklyList={weeklyList}
                                                            x={x}
                                                            list={list}
                                                            id={id}
                                                            program={program}
                                                        />
                                                    </Row>
                                                </Fragment>
                                            )
                                        }else if(!noDataSet && !(daysWithData.includes(day))) {
                                            noDataSet = true;
                                            return(<>No Data To Show for {day}</>)
                                        }
                                    })
                                   }
                            </div>
                        )
                    })
                }
            </div>
        </Fragment>
    )
}



function getDayOfWeekFromMillisecond(milliseconds) {
    const date = new Date(Number(milliseconds));
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
}

function getMilliFromDateAndTime(date, time) {
    return new Date(`${date} ${time}`)
}

function HourEditCard({ timeMilli, status, time, setBy, weeklyList, id, x, program, editedby }) {
    const [recordChanges, setRecordChanges] = useState();
    const [error, setError] = useState();
    const [dropDownStatus, setDropDownStatus] = useState(status);
    const admin = useSelector(isAdmin)
    const userName = useSelector(userSignedIn)

    return (
        <Card key={`card_${x}`}>
            <span
                id='deleteStamp'
                onClick={() => {
                    console.log(id, timeMilli);
                }}
            >X</span>
            <Card.Body key={`card_body${x}`}>
                <Card.Title key={`card_Title${x}`}>
                    <div id='timeStampTitle' key={`card_text${x}`}>
                        <div>
                            {getDayOfWeekFromMillisecond(timeMilli)}
                        </div>
                    </div>
                </Card.Title>
                <Form.Group key={`formgroup_${x}`}>

                    {!admin ?
                        <Card.Text key={`card_1${x}`}>Clocked {dropDownStatus}</Card.Text> :

                        <Dropdown>
                            <Dropdown.Toggle

                                variant="secondary" id="dropdown-basic">
                                Clocked {toCapitalize(dropDownStatus)}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                onClick={(e) => {
                                    setDropDownStatus(e.target.text)
                                }}
                            >
                                <Dropdown.Item value={'out'} href="#/action-1">out</Dropdown.Item>
                                <Dropdown.Item value={'in'} href="#/action-2">in</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }

                </Form.Group>
                <Form.Group key={`formcard_${x}`}>
                    <input
                        readOnly={!admin}
                        onBlur={(e) => { setRecordChanges({ ...recordChanges, date: e.target.value }) }}
                        defaultValue={getDateFromMilli(timeMilli)}></input>
                </Form.Group>
                <Form.Group>
                    <input
                        readOnly={!admin}
                        onBlur={(e) => { setRecordChanges({ ...recordChanges, time: e.target.value }) }}
                        defaultValue={convertMilitaryToStandard(time)}></input>
                </Form.Group>
                <Form.Group>
                    <input
                        readOnly={!admin}
                        onBlur={() => { setRecordChanges({ ...recordChanges, setBy }) }}
                        defaultValue={setBy}></input>
                </Form.Group>
                <Card.Footer>
                    <Row>
                        <Col
                            className={error ? "error-outofBounds" : ''}
                        >{error ? `${error}` : ''}</Col>
                        <Col >
                            {admin ?

                                <Button
                                    disabled={!recordChanges}
                                    onClick={() => {
                                        const millisecondChange = new Date(`${recordChanges.date} ${recordChanges.time}`).getTime();
                                        if (weeklyList[x].status == 'in' &&
                                            (weeklyList[x - 1] == undefined || millisecondChange > Number(weeklyList[x - 1]?.timeMilli)) &&
                                            (weeklyList[x + 1] == undefined || millisecondChange < Number(weeklyList[x + 1].timeMilli))) {

                                            updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges, program, 'status': dropDownStatus, 'editedby': userName }, setHistoryBulk)
                                            setError('');
                                        } else if (weeklyList[x].status == 'out' &&
                                            millisecondChange > Number(weeklyList[x - 1]?.timeMilli) &&
                                            (weeklyList[x + 1] == undefined || millisecondChange < Number(weeklyList[x + 1].timeMilli))) {
                                            updateItem('/updatestudentrecord', { id, milliIndex: timeMilli, recordChanges, program, 'status': dropDownStatus, 'editedby': userName }, setHistoryBulk)
                                            setError('');
                                        } else {
                                            setError('Input Out of Bounds');
                                        }
                                    }}
                                    variant="info">Save</Button> :
                                <></>
                            }
                        </Col>
                    </Row>
                    {editedby ?
                        <Row>
                            <div>Edited By {editedby}</div>
                        </Row>
                        : <></>}
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}