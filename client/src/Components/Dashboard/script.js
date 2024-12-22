import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, CardTitle, Form, Dropdown } from "react-bootstrap";
import { Calendar } from 'primereact/calendar';

import { useSelector } from 'react-redux';
import ExportCSV, {
    displaySchoolInsights,
    toCapitalize,
    getStudentStatus,
    getTimeFromMillisecond,
    getHoursWorked,
    filterByPrograms,
    getStudentHistory,
    getDateFromMilli
} from './helpers.js'
import { studentHistory } from "../../app/StudentHistorySlice.js";
import './style.css';
import { students } from "../../app/EmployeeListSlice.js";
import { convertMilitaryToStandard } from "../TimeClock/helper.js";
import { getData } from "../../globalUtils/requests.js";
import { oneDaySnapshot, dashBoardSnapShot } from "../../app/DashboardSlice.js";
export default () => {
    const employeeList = useSelector(students);
    const history = useSelector(studentHistory);
    const snapshot = useSelector(dashBoardSnapShot);
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [empProg, setEmpProg] = useState();
    const [dates, setDates] = useState();
    const programKeys = ['Aspire', 'Richardson Industries'];
    console.log('shot',snapshot);

    let x, y;
    return (
        <Fragment>
            <h1>Insight</h1>
            <Container>
                <Card>
                    <Row>
                        <Col>
                            Single Date Insights: <Calendar onChange={(e) => {
                                getData(`/getsingledateinsights/${new Date(e.target.value).getTime()}`, 'GET', oneDaySnapshot)
                            }}
                                showIcon />
                        </Col>
                    </Row>

                    {Object.keys(snapshot).length > 0 ?
                        Object.keys(snapshot.programTotals).map(program => (
                            <Row>
                                <Col>
                                    {program}:{snapshot.programTotals[program]}
                                </Col>
                                <Col>
                                    Date Clockin Amount:{snapshot.clockedInTotals[program]}
                                </Col>
                                <Col>
                                    Date Clockin percentage: { (Number(snapshot.clockedInTotals[program]) / Number(snapshot.programTotals[program]) * 100)}%
                                </Col>
                            </Row>
                        )):''
                    }
                    {/* <Row>
                        <Col>
                            Richardson
                        </Col>
                        <Col>
                            Date Clockin Amount
                        </Col>
                        <Col>
                            Date Percentage
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Aspire
                        </Col>
                        <Col>
                            Date Clockin Amount
                        </Col>
                        <Col>
                            Date Percentage
                        </Col>
                    </Row> */}

                </Card>
            </Container>

            <Container className="marginBottom">
                {employeeList ? displaySchoolInsights("Aspire", filterByPrograms('Aspire', employeeList)) : ''}
                {employeeList ? displaySchoolInsights("Richardson Industries", filterByPrograms('Richardson Industries', employeeList)) : ''}

                <Card >
                    <Row className="marginBottom">
                        <Col>
                            {
                                programKeys.map(pg => (
                                    <Col>
                                        <h3 id='clockedIn'>{pg} Clocked In</h3>
                                        {getStudentStatus('in', employeeList, pg)?.map(emp => (
                                            <p
                                                onClick={() => {
                                                    setSelectedEmployee(emp)
                                                    setEmpProg(Object.keys(emp.programs)[0])
                                                }}
                                                className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                            >{emp.name}</p>
                                        ))}
                                    </Col>
                                ))
                            }
                        </Col>
                        <Col>
                            {programKeys.map(pg => (
                                <Col>
                                    <h3 id='clockedOut'>{pg} Clocked Out</h3>
                                    {getStudentStatus('out', employeeList, pg)?.map(emp => (
                                        <p className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                            onClick={() => { setSelectedEmployee(emp) }}
                                        >{emp.name}</p>
                                    ))}
                                </Col>
                            ))
                            }
                        </Col>
                    </Row>
                </Card>
            </Container>
            <Container>
                {selectedEmployee && getStudentHistory(selectedEmployee.id, Object.values(history))[0] ?
                    <>
                        <Card>
                            <Card.Header>
                                <div
                                    className='removeSelectedEmp'
                                    onClick={() => {
                                        setSelectedEmployee(null);
                                    }}
                                >X</div>
                            </Card.Header>
                            <Dropdown
                                className="progSelector"
                            >
                                <Dropdown.Toggle variant="info" id="dropdown-basic">
                                    {empProg ? empProg : 'Select Program'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                    onClick={(e) => {
                                        setEmpProg(e.target.textContent)
                                    }}
                                >
                                    {Object.keys(selectedEmployee.programs).map((prog) => (
                                        <>
                                            <Dropdown.Item value={prog} href={`#/${prog}`}>{prog}</Dropdown.Item>
                                        </>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <>
                                <Container className="marginTop">
                                    {console.log(empProg)}
                                    <div className="export">
                                        <div>
                                            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />
                                        </div>
                                        <div className="exportButton">
                                            <ExportCSV data={getCsvData(getStudentHistory(selectedEmployee?.id, Object?.values(history), dates, empProg), empProg)} fileName={`${selectedEmployee.name}`} />
                                        </div>

                                    </div>
                                </Container>
                                <h3>{selectedEmployee.name} : {toCapitalize(selectedEmployee.type)}</h3>

                                {getStudentHistory(selectedEmployee?.id, Object.values(history), dates, empProg)[0][empProg]?.map((history, i) => {
                                    if (history.status == 'in') {
                                        x = history.timeMilli
                                    } else {
                                        y = history.timeMilli
                                    }
                                    return (
                                        <>
                                            <Row className="marginBottom">
                                                <Col>
                                                    {getDateFromMilli(history.timeMilli)}
                                                </Col>
                                                <Col>
                                                    <Card className="alignRight marginRight">
                                                        <p>Clocked {toCapitalize(history.status)}: {convertMilitaryToStandard(getTimeFromMillisecond(history.timeMilli))}</p>
                                                        <p>Set By: {history.setBy}</p>
                                                    </Card>
                                                    {
                                                        history.status == 'out' ?
                                                            <text>{getHoursWorked(x, y)} hrs</text>
                                                            : ''
                                                    }
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                })}
                            </>
                        </Card>
                    </>
                    : ''}

            </Container>
        </Fragment>
    )
}

function getCsvData(filteredData, program) {
    let row = [];
    let collection = [];
    let totalHours = [];
    let x, y;
    let newRow = {};
    console.log(filteredData)
    if (program && filteredData[0][program] && filteredData[0][program].length > 0) {
        row.push(Object.keys(filteredData[0]));
        collection.push(['DateIn', 'TimeIn', 'DateOut', 'TimeOut', 'CheckedInBy', 'CheckedOutBy', 'TotalHours'])
        filteredData[0][program].forEach(filteredOBj => {
            if (filteredOBj.status == "in") {
                newRow = {}
                newRow.DateIn = getDateFromMilli(filteredOBj.timeMilli)
                newRow.TimeIn = convertMilitaryToStandard(filteredOBj.time)
                newRow.CheckedInBy = filteredOBj.setBy

                x = filteredOBj.timeMilli
                y = null
            } else {
                newRow.DateOut = getDateFromMilli(filteredOBj.timeMilli)
                newRow.TimeOut = convertMilitaryToStandard(filteredOBj.time)
                newRow.CheckedOutBy = filteredOBj.setBy
                y = filteredOBj.timeMilli
            }
            if (x && y) {
                const hrsWrked = getHoursWorked(x, y);
                totalHours.push(hrsWrked)
                newRow.Total = hrsWrked
                collection.push(newRow)
            }
        })
        // DateIn	DateOut	TimeIn	TimeOut	SetBy	Total Hours     
        console.log(collection);

        return collection;
    }
    return collection;
}