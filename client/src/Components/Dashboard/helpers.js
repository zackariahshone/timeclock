import React from "react";
import { Col, Row, Card } from "react-bootstrap";



export const displayStaffCount = (staffType,staffList) => {
    let staffCount = 0;
    return (<Row className="marginBottom">
        <Col >
            <Card>
                <Card.Title>Number of {toCapitalize(staffType)}s</Card.Title>
                <p>{filterByType(staffType, staffList).length}</p>
            </Card>
        </Col>
        <Col >
            <Card>
                <Card.Title> Clocked In</Card.Title>
                {/* {filterByType(staffType, staffList).forEach(emp => {
                    if (emp.status == 'in') {
                        staffCount += 1;
                    }
                })} */}
                <p>{staffTotal(filterByType(staffType,staffList))}</p>
            </Card>
        </Col>
    </Row>
    )
}

export const filterByType = (type,staffList)=>{
    return staffList?.filter(staff=>staff.type.toLowerCase() == type.toLowerCase())
}

export const toCapitalize=(str)=>{
    return  `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export const getEmployeeStatus =(status, employees)=> {
    switch (status) {
        case 'in':
            return employees.filter((employee) => (employee.status == 'in'));
        case 'out':
            return employees.filter((employee) => (employee.status == 'out'));
        default:
            return;
    }
}

export const getTimeFromMillisecond = (milliseconds)=> {
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
    return clockedOut != undefined ? (Number(clockedOut) - Number(clockedIn)) / (1000) : 0 ;
}

export const staffTotal = (list)=>{
    let count = 0
    console.log(list);
    
    list.forEach(emp => {
        if (emp.status == 'in') {
            count += 1;
        }
    })
    return count; 
}