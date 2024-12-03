import React, { useEffect, useState } from "react";
import {  teachers, students, addEmployee, removeEmployee } from "../../app/EmployeeListSlice";
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
import { deleteItem } from "../../globalUtils/requests";
import { getStudentHistory } from "../Dashboard/helpers";
import { studentHistory } from "../../app/StudentHistorySlice";
import { EditItemModal } from "../EditRecord/helpers";
import { isAdmin } from "../../app/CurrentUserSlice";
export default (props) => {
    const { type } = props;
    const studentList = useSelector(students);
    const teacherList = useSelector(teachers);
    let filteredList = type == 'teacher' ? teacherList : studentList;
    const [show, setShow] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchText, setSearchText] = useState();
    const [change, setChange] = useState(false);
    const [record, setRecord] = useState();
    const history = useSelector(studentHistory)
    const admin = useSelector(isAdmin)

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
                    {admin ? 
                    <Col  xs={12} md={3} >
                        <Card 
                        onClick={()=>{
                            setShow(true);
                        }}
                        className="createNewCard">
                            <div className="textInCreateCard">Creat new {type}</div>
                        </Card>
                    </Col>:''
                        }
                    {SchoolListDisplay(searchText, filteredList, setRecord,setChange,setShowEditModal,admin)}
                   {type == 'student' && record && showEditModal ? <EditItemModal show={showEditModal} setShow ={setShowEditModal} record={record} list= {getStudentHistory(record.id, Object.values(history))[0]?.clockedInOutHistory} />:''}
                </Row>
            </Col>
            {show ? <CreateStaffModal type={type} show = {show} setShow ={setShow}/>:''}
        </Container>
    )
}

function SchoolListDisplay(index, empList,setRecord,setChange,setShowEditModal,admin) {
    const filtered = empList.filter(emp => emp.name.toLowerCase().includes(index?.toLowerCase()));
    return (
        (index ? filtered : empList).map((employee) => (
            <Col id="empCard" xs={12} md={3}>
                <Card
                   
                >
                <Card.Header className="textRight">
                    {
                        admin ?
                        <text 
                        onClick = {()=>{
                            deleteItem(`/delete${employee.type}`,{id:employee.id},removeEmployee)
                        }}
                        className="deleteButton">x</text>:''
                    }
                    </Card.Header>
                    <Card.Body>
                        <Card.Title> Name: {employee.name}</Card.Title>
                        <Card.Text>Date Added: {employee.dateStarted}</Card.Text>
                        {employee.buildingName ? <p>{employee.buildingName}</p> : ''}
                    </Card.Body>
                    <Card.Footer> 
                    <Row>
                        <Col>
                        </Col>
                        { employee.type == "student"?<Col>

                        <Button
                         onClick={()=>{
                            setRecord(employee)
                            setShowEditModal(true)
                            setChange(true);
                        }}
                        > View Hours</Button>
                        </Col>:''}
                    </Row>
                    </Card.Footer>
                </Card>
            </Col>
        ))
    );
}