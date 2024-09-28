import React, { useEffect, useState } from "react";
import { Col, Row, Container, Button, Card, InputGroup, Form } from "react-bootstrap";



const emps = [
    {
        name: 'Bob',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out"
    },
]
export default (props) => {
    const [statusChange, setStatusChange] = useState();
    useEffect(() => {
        setStatusChange(false);
    }, [statusChange])
    return (
        emps.map((employee) => {
        const now = new Date();
            return (

                <Card body>
                    <Row>
                        <Col xs={2}>
                            <text>{employee.name}</text>
                        </Col>
                        <Col xs={2}>
                            <text>{employee.status}</text>
                        </Col>
                        <Col xs ={4}>
                            <InputGroup className="mb-3">
                                <Form.Control value={employee.timeIn?employee.timeIn:''} aria-label="First name" />
                                <Form.Control value={employee.timeOut?employee.timeOut:''} aria-label="Last name" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => {
                                    if(employee.status == "out"){
                                        employee.status = 'in'
                                        employee.timeIn = `${new Date().getHours()}:${new Date().getMinutes()}`
                                        employee.timeOut = '';
                                    }
                                    else{
                                        employee.status = 'out'
                                        employee.timeOut = `${new Date().getHours()}:${new Date().getMinutes()}`
                                    }
                                    
                                    setStatusChange(true);
                                    console.log('staus ' + employee.status, 'timein '+employee.timeIn, 'timeout' + employee.timeOut);
                                }}
                                variant={employee.status == "out" ? 'info' : 'danger'}>  {employee.status == "out" ? 'Check In' : 'Check Out'} </Button>
                        </Col>
                    </Row>
                </Card>
            )
        })
    )
}