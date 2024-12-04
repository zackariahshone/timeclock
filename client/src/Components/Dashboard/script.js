import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, CardTitle, Form } from "react-bootstrap";
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
export default () => {
    const employeeList = useSelector(students)
    const history = useSelector(studentHistory)
    const [selectedEmployee, setSelectedEmployee] = useState();
  
    const [dates, setDates] = useState();
    let x,y;
    return (
        <Fragment>
            <h1>Insight</h1>
            <Container>
                <Card>
                    <Row>
                        <Col>
                            Date Filter: <Calendar onChange={()=>{}} 
                                showIcon/>
                        </Col>
                    </Row>
                    <Row>
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
                    </Row>
                    
                </Card>
            </Container>

            <Container className="marginBottom">
                {employeeList ? displaySchoolInsights("aspire", filterByPrograms('aspire', employeeList)) : ''}
                {employeeList ? displaySchoolInsights("richardson industries", filterByPrograms('richardson industries', employeeList)) : ''}
               
                <Card >
                    <Row className="marginBottom">
                        <Col>
                            <h3 id='clockedIn'>Clocked In</h3>
                            {getStudentStatus('in', employeeList)?.map(emp => (
                                <p
                                    onClick={() => { setSelectedEmployee(emp) }}
                                    className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                        <Col>
                            <h3 id='clockedOut'>Clocked Out</h3>
                            {getStudentStatus('out', employeeList)?.map(emp => (
                                <p className={`employeeList ${selectedEmployee?.name == emp.name ? 'selected' : ''}`}
                                    onClick={() => { setSelectedEmployee(emp) }}
                                >{emp.name}</p>
                            ))
                            }
                        </Col>
                    </Row>
                </Card>
            </Container>
            <Container >
                {selectedEmployee &&  getStudentHistory(selectedEmployee.id,Object.values(history))[0]?.clockedInOutHistory ? 
                    <>   
                    <Card >
                        <>
                    <Container className="marginTop">

                        <div className="export">
                            <ExportCSV style={{marginRight:'2%'}} data={getCsvData(getStudentHistory(selectedEmployee?.id, Object?.values(history),dates))} fileName={`${selectedEmployee.name}`}/>
                            <Calendar  value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />
                        </div>
                    </Container>
                            <h3>{selectedEmployee.name} : {toCapitalize(selectedEmployee.type)}</h3>
                            {
                                getStudentHistory(selectedEmployee?.id, Object.values(history),dates)[0].clockedInOutHistory.map((history, i) => {
                                if(history.status == 'in'){
                                    x = history.timeMilli
                                }else{
                                    y=history.timeMilli
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
                                                    <text>{getHoursWorked(x,y)} hrs</text>
                                            :''
                                        }
                                        </Col>
                                    </Row>
                                    </>
                                )
                            })
                            }
                        </>
                    </Card>
                    </>
                    : ''}

            </Container>
        </Fragment>
    )
}

function getCsvData(filteredData){    
    let row = [];
    let collection =[];
    let totalHours = [];
    let x, y;
    let newRow = {};
    if(filteredData[0].clockedInOutHistory.length > 0){
        row.push(Object.keys(filteredData[0]));
        collection.push(['DateIn','DateOut','TimeIn','TimeOut','CheckedInBy', 'CheckedOutBy','TotalHours'])
        filteredData[0].clockedInOutHistory.forEach(filteredOBj =>{
            if(filteredOBj.status == "in"){
                newRow = {}
                newRow.DateIn = getDateFromMilli(filteredOBj.timeMilli)
                newRow.TimeIn = convertMilitaryToStandard(filteredOBj.time)
                newRow.CheckedInBy = filteredOBj.setBy

                x = filteredOBj.timeMilli
                y = null
            }else{ 
                newRow.DateOut = getDateFromMilli(filteredOBj.timeMilli)
                newRow.TimeOut = convertMilitaryToStandard(filteredOBj.time)
                newRow.CheckedOutBy = filteredOBj.setBy
                y = filteredOBj.timeMilli 
            }
            if(x && y){               
                const hrsWrked = getHoursWorked(x,y); 
                totalHours.push(hrsWrked)
                newRow.Total = hrsWrked
                collection.push(newRow)
            }
        })
            // DateIn	DateOut	TimeIn	TimeOut	SetBy	Total Hours       
        return collection;
    }
    return collection;
}