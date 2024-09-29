import React, { useState } from "react";
import { addEmployee } from "../../app/EmployeeListSlice";
import {
    Container,
    Card,
    Col,
    Row,
    Button
} from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import './style.css'


export default (props) => {
    const [empName, setEmpName] = useState();
    const [building, setBuilding] = useState();
    const employeeList = useSelector((state) => state.employeeList.employees)
    const dispatch = useDispatch();  
    
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
                                        dispatch(addEmployee({
                                            name: empName,
                                            dateStarted: new Date().toDateString(),
                                            buildingName: building,
                                            status:'out'
                                        }))
                                        setEmpName('');
                                    }
                                }}
                            > Create </Button>
                        </Col>
                    </Row>
                </Card>

            </Col>
            <Col>
                <Row>
                    {employeeList.map((employee) => (
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