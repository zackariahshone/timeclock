import React, { useState } from "react";
import { Col, Container, Form, Modal, Row, Button, Card } from "react-bootstrap";
import { getData, updateItem } from "../../globalUtils/requests";
import { useDispatch, useSelector } from "react-redux";
import { userSignedIn } from "../../app/CurrentUserSlice";
import { updateBulkTime } from "../../app/EmployeeListSlice";
import { setHistoryBulk, updateBulkHistory } from "../../app/StudentHistorySlice";
import './style.css'
export const BulkCheckin = ({ show, setShow, studentList, program }) => {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const currentUser = useSelector(userSignedIn);
    const timeCheckedin = new Date().getTime();
    const dispatch = useDispatch();
    let checkedCollection = {}
    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
        >
            <Container>
                <Row
                    className="marginRow"
                >

                    {studentList.map((student) => {
                        
                        
                    
                        return (
                                <StudentquickList student={student} program={program} checkedCollection={checkedCollection}/>
                            // <Col>
                            //     <Form>
                            //                                          <Form.Check // prettier-ignore
                            //             defaultChecked={student.programs[program] == 'in'}
                            //             type={'checkbox'}
                            //             id={`default`}
                            //             label={`${student.name}`}
                            //             onChange={(e) => {
                            //                 if (!(student.programs[program] == 'in' && e.target.checked == true) &&
                            //                     !(student.programs[program] == 'out' && e.target.checked == false)) {
                            //                     checkedCollection.changes = { ...checkedCollection?.changes, [student.id]: { [program]: e.target.checked } }
                            //                 } else if (checkedCollection.changes[student.id]) {
                            //                     delete checkedCollection.changes[student.id]
                            //                 }
                            //             }}
                            //         />
                            //     </Form>
                            // </Col>
                        )
                    })}
                </Row>
            </Container>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={() => {
                    if (Object.keys(checkedCollection).length > 0) {
                        checkedCollection.time = timeCheckedin
                        checkedCollection.program = program
                        checkedCollection.setBy = currentUser
                        console.log(checkedCollection);
                        
                        const cleanupCall = { 'route': '/getstudenthistory', 'method': 'GET', 'action': setHistoryBulk }
                        updateItem('/bulkupdatetimeclock', checkedCollection, [updateBulkTime, updateBulkHistory], cleanupCall)
                        // getData('/getstudenthistory', 'GET', setHistoryBulk);
                    }
                    handleClose();
                }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )

}


export const StudentquickList = ({student, program,checkedCollection}) => {
    const [checked, setChecked] = useState(student.programs[program] != 'in')
    
    return (
            <Col xs={2}>
                    <div className="buttonMgnBottom">

                        <Button
                            className="buttonMgnBottom"
                            variant={checked ? "info" : "danger"}
                            onClick={() => {
                                setChecked(!checked);
                                if (!(student.programs[program] == 'in' && checked == true) &&
                                !(student.programs[program] == 'out' && checked == false)) {
                                checkedCollection.changes = { ...checkedCollection?.changes, [student.id]: { [program]: checked } }
                            } else if (checkedCollection.changes[student.id]) {
                                delete checkedCollection.changes[student.id]
                            }
                                console.log(checked);
                            }}
                        >
                            {student.name}
                        </Button>
                    </div>
            </Col>
        )

}