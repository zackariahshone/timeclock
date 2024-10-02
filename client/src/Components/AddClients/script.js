import React, { useEffect, useState } from "react";
import { addEmployee, clients, contractors} from "../../app/EmployeeListSlice";
import {
    Container,
    Card,
    Col,
    Row,
    Button,
    InputGroup,
    Form
} from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import './style.css'


export default (props) => {
    const { type } = props;
    const contractorList = useSelector(contractors);
    const clientList = useSelector(clients)
    let filteredList = type == 'clients'?clientList:contractorList;
    // const originalEmployeeList =  useSelector((state) => state.employeeList.employees).filter(emp => emp.type.toLowerCase() == type.toLowerCase());
    const dispatch = useDispatch();
    const [empName, setEmpName] = useState();
    const [building, setBuilding] = useState();
    const [searchText, setSearchText] = useState();
    // const [employeeList, setEmployeeList] = useState(type == 'clients'?clientList:contractorList); 
    const [change, setChange] = useState(false);
    useEffect(()=>{
       if(change == true){
        setChange(false);
       }
    },[change])
    return (
        <Container>
            <h1>{type.toUpperCase()}</h1>
            <Row>
                <Col xs={4}>
                    <InputGroup 
                    onChange={(e)=>{
                        setSearchText(e.target.value);
                    }}
                    className="mb-3">
                        <Form.Control
                            placeholder={`Search ${type}`}
                            aria-label={`Search ${type}`}
                            aria-describedby="basic-addon2"
                        />
                       🔎
                    </InputGroup>
                </Col>

            </Row>
            <Col>
                <Card className="addClientCard">
                    <Row>
                        <Col>
                            Enter New Employee
                        </Col>
                    </Row>
                    <Row>
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
                                            status: 'out',
                                            history: [],
                                            type
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
                    {EmployeeListDisplay(searchText,filteredList)}
                </Row>
            </Col>
        </Container>
    )
}

function EmployeeListDisplay(index, empList){
    const filtered = empList.filter(emp => emp.name.includes(index));    
    return(
        (index ? filtered:empList).map((employee) => (
            <Col id="empCard" xs={12} md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title> Name: {employee.name}</Card.Title>
                        <Card.Text>Date Added: {employee.dateStarted}</Card.Text>
                        <Card.Text>Building Name: {employee.buildingName ? <p>{employee.buildingName}</p> : ''}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        ))
    );
}