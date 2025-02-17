import React from "react";
import { Col, Row, Card,Button } from "react-bootstrap";



export const displaySchoolInsights = (program, staffList) => {
    return (<Row className="marginBottom">
        <h3 className = "insightsStaffType">{toCapitalize(program)}:</h3>
        <Col >
            <Card>
                <Card.Title>Number of {toCapitalize(program)} Students</Card.Title>
                <p>{filterByPrograms(program, staffList,program).length}</p>
            </Card>
        </Col>
        <Col >
            <Card>
                <Card.Title> Clocked In</Card.Title>
                <p>{staffTotal(filterByPrograms(program, staffList),program)}</p>
            </Card>
        </Col>
        <Col>
            <Card>
                <Card.Title>Percentage Of {toCapitalize(program)}s Clocked In</Card.Title>
                <b>{Number(getStudentStatus('in', filterByPrograms(program, staffList),program).length / filterByPrograms(program, staffList,program).length * 100).toFixed(2)}%</b>
            </Card>
        </Col>
    </Row>
    )
}

export const filterByType = (type, staffList) => {
    return staffList?.filter(staff => staff.type.toLowerCase() == type.toLowerCase())
}

export const filterByPrograms = (program, studentList) =>{    
    return studentList.filter(student => Object.keys(student.programs).includes(program))
}

export const toCapitalize = (str) => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export const getStudentStatus = (status, students,program) => {    
    switch (status) {
        case 'in':
            return students.filter((student) => (student?.programs[program] == 'in'));
        case 'out':
            return students.filter((student) => (student?.programs[program] == 'out'));
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

export const getHoursWorked = (milliIn, milliOut) => {
    return milliOut !== undefined ? ((Number(milliOut) - Number(milliIn)) / (1000 * 60 * 60)).toFixed(2) : 0;
}

export const getDateFromMilli = (milli) => {
    
    const date = new Date(Number(milli));    
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();
  
    // Add leading zeros if needed
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
  
    return `${formattedMonth}/${formattedDay}/${year}`;
}
export const staffTotal = (list,program) => {    
    let count = 0
    list.forEach(emp => {
        if (emp.programs[program] == 'in') {
            count += 1;
        }
    })
    return count;
}

export const getStudentHistory = (id,historyList,timefilter,programKey) =>{  
    if(timefilter !== undefined && timefilter.length == 2 && programKey){
        const filterOne = new Date(timefilter[0]).getTime()
        const filterTwo = new Date(timefilter[1]).getTime();
        const twetnyFourHours = 24 * 60 * 60 * 1000; 
        let listFilteredByID = historyList.filter(doc=>doc.id == id)            
        let clockedInOutHistory = listFilteredByID[0][programKey].filter(history => history.timeMilli > filterOne && history.timeMilli  < filterTwo + (twetnyFourHours) );
        
        return [{id:listFilteredByID[0].id ,[programKey]:clockedInOutHistory}]  
        
    }else{
        const dummyData = [{[programKey]:[]}]
        console.log(dummyData[0][programKey]);
        console.log(historyList.filter(doc=>doc?.id == id));
        
        return  historyList.filter(doc=>doc?.id == id).length > 0 ?
                historyList.filter(doc=>doc?.id == id) :
                [{[programKey]:[]}];    
    }
} 


const ExportCSV = ({ data, fileName }) => {
    
  const downloadCSV = () => {
    // Convert the data array into a CSV string  
        // DateIn	DateOut	TimeIn	TimeOut	CheckedInBy, CheckedOutBy	Total Hours

    const csvString = [
        data[0], // Specify your he   `aders here
        ...data.map(item => [item.DateIn, item.TimeIn,item.DateOut, item.TimeOut, item.CheckedInBy ,item.CheckedOutBy,item.Total]) // Map your data fields accordingly
    ]
    .map(row => row.join(","))
    .join("\n");
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <Button onClick={downloadCSV}>Export CSV</Button>;
};

export default ExportCSV;