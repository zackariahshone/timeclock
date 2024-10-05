import React, { useEffect, useState } from "react";
import { addEmployee, contractors, employees } from "../../app/EmployeeListSlice";
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
import { CreateStaffModal } from "./helpers";
import './style.css'


const ContractorDummynames = [
    'Elin Mays',
    'Bronwyn Powell',
    'Zaynah Vaughn',
    'Caleb Guzman',
    'Sinead OMoore',
    'Louise Pierce',
    'Conor Bullock',
    'Tomasz Shepard',
    'Cian Shah',
    'Clara Martinez']
const clientDummyNames = ['Aysha Whitehead',
    'Tobias Sandoval',
    'Lloyd Tate',
    'Solomon Jordan',
    'Donna Hanna',
    'Mila Moses',
    'Aled Ballard',
    'Zuzanna Pittman',
    'Eva Gaines',
    'Arun Newman']

export default (props) => {
    const { type } = props;
    const contractorList = useSelector(contractors);
    const employeeList = useSelector(employees);
    let filteredList = type == 'employee' ? employeeList : contractorList;
    const [show, setShow] = useState(false);
    const [searchText, setSearchText] = useState();
    const [change, setChange] = useState(false);
    useEffect(() => {
        if (change == true) {
            setChange(false);
        }
    }, [change])
    return (
        <Container>
            <h1>{type.toUpperCase()}</h1>
            <Row>
                <Col xs={4}>
                    <InputGroup
                        onChange={(e) => {
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
                <Row>
                    <Col  xs={12} md={3} >
                        <Card 
                        onClick={()=>{
                            setShow(true);
                        }}
                        className="createNewCard">
                            <div className="textInCreateCard">Creat new {type}</div>
                        </Card>
                    </Col>
                    {EmployeeListDisplay(searchText, filteredList)}
                </Row>
            </Col>
            {show ? <CreateStaffModal type={type} show = {show} setShow ={setShow}/>:''}
        </Container>
    )
}

function EmployeeListDisplay(index, empList) {
    const filtered = empList.filter(emp => emp.name.toLowerCase().includes(index?.toLowerCase()));
    return (
        (index ? filtered : empList).map((employee) => (
            <Col id="empCard" xs={12} md={3}>
                <Card>
                    <Card.Body>
                        <Card.Title> Name: {employee.name}</Card.Title>
                        <Card.Text>Date Added: {employee.dateStarted}</Card.Text>
                    </Card.Body>
                    <Card.Footer> {employee.buildingName ? <p>{employee.buildingName}</p> : ''}</Card.Footer>
                </Card>
            </Col>
        ))
    );
}
