import React, { useEffect, useState } from "react";
import { Col, Row, Container, Button, Card } from "react-bootstrap";



const emps = [
    {
        name: 'one',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'two',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'three',
        dateStarted: '10/10/24',
        status: "out"
    },
    {
        name: 'four',
        dateStarted: '10/10/24',
        status: "out"
    },
]
export default (props) => {
    const [statusChange, setStatusChange] = useState();
    useEffect(()=>{
        setStatusChange(false);
    },[statusChange])
    return (
        emps.map((employee) => {
            return (

                <Card body>
                    <Row>
                        <Col>
                            <text>{employee.name}</text>
                        </Col>
                        <Col>
                            <text>{employee.status}</text>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => {
                                    employee.status == "out" ? employee.status = 'in' : employee.status = 'out';
                                    setStatusChange(true);
                                }}
                                variant={employee.status == "out" ? 'info' : 'danger'}>  {employee.status == "out" ? 'Check In' : 'Check Out'} </Button>
                        </Col>
                    </Row>
                </Card>
            )
        })
    )
}