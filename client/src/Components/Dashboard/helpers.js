import React from "react";
import { Col, Row, Card } from "react-bootstrap";



export const displaySchoolInsights = (program, staffList) => {
    return (<Row className="marginBottom">
        <h3 className = "insightsStaffType">{toCapitalize(program)}:</h3>
        <Col >
            <Card>
                <Card.Title>Number of {toCapitalize(program)} Students</Card.Title>
                <p>{filterByPrograms(program, staffList).length}</p>
            </Card>
        </Col>
        <Col >
            <Card>
                <Card.Title> Clocked In</Card.Title>
                <p>{staffTotal(filterByPrograms(program, staffList))}</p>
            </Card>
        </Col>
        <Col>
            <Card>
                <Card.Title>Percentage Of {toCapitalize(program)}s Clocked In</Card.Title>
                <b>{Number(getStudentStatus('in', filterByPrograms(program, staffList)).length / filterByPrograms(program, staffList).length * 100).toFixed(2)}%</b>
            </Card>
        </Col>
    </Row>
    )
}

export const filterByType = (type, staffList) => {
    return staffList?.filter(staff => staff.type.toLowerCase() == type.toLowerCase())
}

export const filterByPrograms = (program, studentList) =>{
    
    return studentList.filter(student => student.program.toLowerCase() == program.toLowerCase())
}

export const toCapitalize = (str) => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export const getStudentStatus = (status, students) => {
    switch (status) {
        case 'in':
            return students.filter((student) => (student.status == 'in'));
        case 'out':
            return students.filter((student) => (student.status == 'out'));
        default:
            return;
    }
}

export const getTimeFromMillisecond = (milliseconds) => {
    if (milliseconds) {
        const date = new Date(Number(milliseconds))
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes}`;
    }
    return "On Clock";
}

export const getHoursWorked = (timeStamps) => {
    const dateKey = Object.keys(timeStamps)[0];
    const clockedIn = timeStamps[dateKey].in
    const clockedOut = timeStamps[dateKey].out
    return clockedOut != undefined ? (Number(clockedOut) - Number(clockedIn)) / (1000) : 0;
}

export const staffTotal = (list) => {
    let count = 0
    console.log(list);

    list.forEach(emp => {
        if (emp.status == 'in') {
            count += 1;
        }
    })
    return count;
}
