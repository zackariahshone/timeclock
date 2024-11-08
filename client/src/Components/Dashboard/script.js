import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Card, Button, CardTitle, Form } from "react-bootstrap";
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
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { convertMilitaryToStandard } from "../TimeClock/helper.js";
export default (props) => {
    const employeeList = useSelector(students)
    const history = useSelector(studentHistory)
    const [csvData, setCsvData] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [showStatus, setShowStatus] = useState();
    const [timeFilter, setTimeFilter] = useState({start:'',end:''})
    const [filteredList, setFilteredList] = useState()
    let x,y;
    let r,c; 
    useEffect(()=>{
        if(selectedEmployee){
            setFilteredList(getStudentHistory(selectedEmployee?.id, Object.values(history),timeFilter)[0].clockedInOutHistory)
        }else if(selectedEmployee && (timeFilter.start && timeFilter.end)){
            setFilteredList(getStudentHistory(selectedEmployee?.id, Object.values(history),timeFilter)[0].clockedInOutHistory)
        }
    },[timeFilter])
    return (
        <Fragment>
            <h1>Insight</h1>
            <Container className="marginBottom">
                {employeeList ? displaySchoolInsights("aspire", filterByPrograms('aspire', employeeList)) : ''}
                {employeeList ? displaySchoolInsights("richardson industries", filterByPrograms('richardson industries', employeeList)) : ''}
               
                <Card className={showStatus ? 'showStatus' : 'hideStatus'}>
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
                            {console.log(filteredList)}
                {selectedEmployee &&  getStudentHistory(selectedEmployee.id,Object.values(history))[0]?.clockedInOutHistory ? 
                    <>

                    <Card >
                        <>
                    <Container className="marginTop">
                        <DateRangePicker 
                            onChange={(e)=>{
                                e.forEach((filter,x)=>{
                                    if(filter != null  && x == 0){
                                        setTimeFilter({start:new Date(filter.$d).getTime()})
                                    }else if(filter != null && x == 1){
                                        setTimeFilter({...timeFilter,end:new Date(filter.$d).getTime()})
                                    }
                                })
                            }}
                        />
                        <div className="export">
                            <ExportCSV data={getCsvData(getStudentHistory(selectedEmployee?.id, Object?.values(history)))} fileName={`${selectedEmployee.name}`}/>
                        </div>
                    </Container>
                            <h3>{selectedEmployee.name} : {toCapitalize(selectedEmployee.type)}</h3>
                            {
                                getStudentHistory(selectedEmployee?.id, Object.values(history),timeFilter)[0].clockedInOutHistory.map((history, i) => {
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
    // DateIn	DateOut	TimeIn	TimeOut	CheckedInBy, CheckedOutBy	Total Hours
    let row = [];
    let collection =[];
    let totalHours = [];
    let x, y;
    let newRow = {};
    if(filteredData.length > 0){
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
        console.log(totalHours.reduce((a,b)=>Number(a)+Number(b)));
            // DateIn	DateOut	TimeIn	TimeOut	SetBy	Total Hours

        collection.push({DateIn: '', DateOut: '', TimeIn: '', TimeOut:'',CheckedInBy:'',CheckedOutBy:'Billable Hours','Total':Math.floor(totalHours.reduce((a, b) => Number(a) + Number(b)))})
        return collection;
    }
    return collection;
}