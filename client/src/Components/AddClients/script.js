import React, { useState } from "react";
import {
    Container,
    Card,
    Col,
    Row,
    Button
} from "react-bootstrap";
import './style.css'
const emps = [
    {
        name: 'one',
        dateStarted: '10/10/24',
    },
    {
        name: 'two',
        dateStarted: '10/10/24',
    },
    {
        name: 'three',
        dateStarted: '10/10/24',
    },
    {
        name: 'four',
        dateStarted: '10/10/24',
    },
]

export default (props) => {
    const [empName, setEmpName] = useState();
    const [building, setBuilding] = useState();
    return (
        <Container>
            <Col>
                <Card className="addClientCard">
                    <Row>
                        <Col>
                            Enter New Employee
                        </Col>
                        <Col>
                            <input
                                placeholder="enter name"
                                onBlur={(e) => {
                                    setEmpName(e.target.value)
                                }}
                            />
                        </Col>
                        <Col>
                            <input placeholder={new Date().toDateString()} />
                        </Col>
                        <Col className="radioButtons">
                            <div
                                onChange={(e) => {
                                    setBuilding(e.target.value)
                                }}>
                                <input type="radio" value="house1" name="gender" /> house 1
                                <br />
                                <input type="radio" value="house2" name="gender" /> house 2
                            </div>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => {
                                    if (empName && building) {
                                        emps.push({
                                            name: empName,
                                            dateStarted: new Date().toDateString(),
                                            buildingName: building
                                        })
                                        setEmpName('');
                                        setBuilding('');
                                    }
                                }}
                            > Create </Button>
                        </Col>
                    </Row>
                </Card>

            </Col>
            <Col>
                <Row>
                    {emps.map((employee) => (
                        <Col id="empCard" xs = {12} md={3}>
                            <Card body>
                                <p>{employee.name}</p>
                                <p>{employee.dateStarted}</p>
                                {employee.buildingName ? <p>{employee.buildingName}</p> : ''}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Container>
    )
}