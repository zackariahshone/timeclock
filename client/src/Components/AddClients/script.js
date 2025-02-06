import React, { Fragment, useEffect, useState } from "react";
import { teachers, students, addEmployee, removeEmployee, inactiveStudents, addEmployeeBulk, activateStudent } from "../../app/EmployeeListSlice";
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
import { deleteItem, updateItem } from "../../globalUtils/requests";
import { getStudentHistory } from "../Dashboard/helpers";
import { studentHistory } from "../../app/StudentHistorySlice";
import { EditItemModal } from "../EditRecord/helpers";
import { isAdmin } from "../../app/CurrentUserSlice";
import { EditItem } from "../EditItem/script";
export default (props) => {
    const { type } = props;
    const studentList = useSelector(students);
    const teacherList = useSelector(teachers);
    const studentsInactive = useSelector(inactiveStudents);
    let filteredList = type == 'teacher' ? teacherList : studentList;
    const [show, setShow] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchText, setSearchText] = useState();
    const [change, setChange] = useState(false);
    const [record, setRecord] = useState();
    const [program, setProgram] = useState();
    const [showBulkLoad, setShowBulkLoad] = useState();

    const history = useSelector(studentHistory)
    const admin = useSelector(isAdmin)
    const [displayInactive, setDisplayInactive] = useState(false)
    useEffect(() => {
        if (change == true) {
            setChange(false);
        }
    }, [change])
    return (
        <Container>
            <h1>{type.toUpperCase()}</h1>
            <Row>
                <Col md = {3}>
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

                    {
                        admin ?
                            <>
                                <Col>
                                <span>{displayInactive ? "Display Acitve" : "Display Inactive"}</span>
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="custom-switch"
                                        onChange={(e) => {
                                            setDisplayInactive(e.target.checked)
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Card
                                        onClick={() => {
                                            setShow(true);
                                        }}
                                        className="createNewCard">
                                        <div className="textInCreateCard">Creat new {type}</div>
                                    </Card>
                                </Col>
                                {type == "student" ? <Col>
                                    <Card
                                        onClick={()=>{
                                            setShowBulkLoad(true)
                                        }}
                                        className="createNewCard">
                                        <div className="textInCreateCard">Bulk Load {type}</div>
                                    </Card>
                                </Col>:<></>}
                            </>
                            :
                            <></>
                    }
            </Row>
            <Col>
                <Row>
                    {
                        !displayInactive ?
                            <SchoolListDisplay
                                index={searchText}
                                empList={filteredList}
                                setRecord={setRecord}
                                setChange={setChange}
                                setShowEditModal={setShowEditModal}
                                admin={admin}
                                setProgram={setProgram}
                                program={program}
                                active={true}
                            /> : <></>
                    }
                    {type == 'student' && displayInactive ?
                        <>
                            <SchoolListDisplay
                                index={searchText}
                                empList={studentsInactive}
                                setRecord={setRecord}
                                setChange={setChange}
                                setShowEditModal={setShowEditModal}
                                admin={admin}
                                setProgram={setProgram}
                                program={program}
                                active={false}
                            />

                        </>
                        : <></>
                    }
                    {type == 'student' && record && showEditModal ?
                        <EditItemModal
                            show={showEditModal}
                            setShow={setShowEditModal}
                            record={record}
                            list={getStudentHistory(record.id, Object.values(history))[0][program]}
                            program={program}
                        />
                        : ''}
                </Row>
            </Col>
            {show ? <CreateStaffModal type={type} show={show} setShow={setShow} bulk = {false} /> : ''}
            {console.log(showBulkLoad)}
            {showBulkLoad ? <CreateStaffModal type= {type} show={showBulkLoad} setShow={setShowBulkLoad} bulk={true}/>:<></>}
        </Container>
    )
}

function SchoolListDisplay({
    index,
    empList,
    setRecord,
    setChange,
    setShowEditModal,
    admin,
    program,
    setProgram,
    active,
    searchText
}) {
    // const [radio, setRadio] = false(false)
    let filtered = empList.filter(emp => emp.name.toLowerCase().includes(index?.toLowerCase()));
    if(searchText){
        // filtered.filter(emp=>emp.name.toLowerCase().in)
    }
    return (
        (index ? filtered : empList).map((employee) => (
            <Col id="empCard" xs={12} md={6}>
                <EmployeeCard
                    admin={admin}
                    employee={employee}
                    program={program}
                    setRecord={setRecord}
                    setShowEditModal={setShowEditModal}
                    setChange={setChange}
                    setProgram={setProgram}
                    active={active}
                />
            </Col>
        ))
    );
}


function EmployeeCard({
    admin,
    employee,
    program,
    setRecord,
    setShowEditModal,
    setChange,
    setProgram,
    active
}) {
    const [cardprogram, setCardProgram] = useState('programs' in employee ? Object.keys(employee?.programs)[0] : '')
    const [showEditItem, setShowEditItem] = useState();
    return (
        <>
            <Card>
                <Card.Header className="textRight">
                    {
                        admin ?
                            <>
                                <text
                                    className="editItem"
                                    onClick={() => {
                                        setShowEditItem(true)
                                    }}
                                >Edit Card</text>
                                <text
                                    onClick={() => {
                                        if(employee.type != 'teacher'){
                                            updateItem(`/activate${employee.type}`, { id: employee.id, active: !active }, activateStudent)
                                        }else{
                                            deleteItem('/deleteteacher',{id:employee.id},removeEmployee)
                                        }
                                    }}
                                    className="deleteButton">{active ? 'x' : 'activate'}  </text>
                            </>
                            : ''
                    }
                </Card.Header>
                <Card.Body className="textLeft">
                    <Card.Title> Name: {employee.name}</Card.Title>
                    {employee.type == 'teacher' ? <Card.Text>Date Added: {employee?.dateStarted}</Card.Text> : ''}
                </Card.Body>
                <Card.Footer>
                    <Row>
                        {employee.type == "student" ?
                            <Fragment>

                                <Col>
                                    <Form
                                        onChange={(e) => {
                                            setCardProgram(e.target.value)
                                        }}>
                                        Programs:
                                        {Object.keys(employee?.programs).map((prog) => (
                                            <>
                                                <br />
                                                <input type="radio" value={prog} checked={cardprogram == prog} name={prog} /> {prog}
                                            </>
                                        ))}
                                    </Form>
                                </Col>
                                <Col>
                                    <Button
                                        onClick={() => {
                                            setRecord(employee)
                                            setShowEditModal(true)
                                            setChange(true);
                                            setProgram(cardprogram)
                                        }}
                                    > View Hours</Button>
                                </Col>
                            </Fragment>

                            : ''}
                    </Row>
                </Card.Footer>
            </Card>
            {showEditItem ? <EditItem employee={employee} show={showEditItem} setShow={setShowEditItem} /> : <></>}
        </>

    )
}