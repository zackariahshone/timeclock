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
    const [csvData, setCsvData] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [showStatus, setShowStatus] = useState();
    const [timeFilter, setTimeFilter] = useState({start:'',end:''})
    const employeeList = useSelector(students)
    const history = useSelector(studentHistory)
    let x,y;
    let r,c; 
    useEffect(()=>{
        console.log(timeFilter);
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
                        {console.log(getStudentHistory(selectedEmployee?.id, Object?.values(history),timeFilter))}
                            <ExportCSV data={getCsvData(getStudentHistory(selectedEmployee?.id, Object?.values(history)))} fileName={'newfile'}/>
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
                                                <p>Clocked {toCapitalize(history.status)}: {getTimeFromMillisecond(history.timeMilli)}</p>
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
    let x, y;
    if(filteredData.length > 0){
        row.push(Object.keys(filteredData[0]));
        collection.push(['Date']);
        collection[0].push(Object.keys(filteredData[0].clockedInOutHistory[0]))
        collection[0].push('total');
        filteredData[0].clockedInOutHistory.forEach(filteredOBj =>{
            collection.push({...filteredOBj,'date':getDateFromMilli(filteredOBj.timeMilli), 'time':convertMilitaryToStandard(filteredOBj.time),'total':''});
            if(filteredOBj.status == "in"){
                x = filteredOBj.timeMilli
                y = null
            }else{ 
                y = filteredOBj.timeMilli
            }
            if(x && y){               
                const hrsWrked = getHoursWorked(x,y); 
                collection.push({status: '', timeMilli: '', time: '', setBy:'','total':hrsWrked})
            }
        })
        return collection;
    }
    return collection;
}