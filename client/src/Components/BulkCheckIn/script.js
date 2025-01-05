import React from "react";
import { Col, Container, Form, Modal, Row, Button } from "react-bootstrap";
import { updateItem } from "../../globalUtils/requests";
import { useDispatch, useSelector } from "react-redux";
import { userSignedIn } from "../../app/CurrentUserSlice";
import { updateBulkTime } from "../../app/EmployeeListSlice";
import { updateBulkHistory } from "../../app/StudentHistorySlice";
export const BulkCheckin = ({ show, setShow, studentList,program }) => {
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
            size="lg"
            centered
            >
            <Container>
                <Row>

                    {studentList.map((student) => (
                        <Col>
                            <Form>
                                <Form.Check // prettier-ignore
                                    defaultChecked={student.programs[program] == 'in'}
                                    type={'checkbox'}
                                    id={`default`}
                                    label={`${student.name}`}
                                    onChange={(e)=>{
                                        if(!(student.programs[program] == 'in' && e.target.checked == true)&& 
                                           !(student.programs[program] == 'out' && e.target.checked == false)){
                                               checkedCollection.changes = {...checkedCollection?.changes,[student.id]:{[program]:e.target.checked}}
                                        }else if( checkedCollection.changes[student.id]){
                                           delete checkedCollection.changes[student.id]
                                        }
                                        console.log(checkedCollection)
                                    }}
                                />
                            </Form>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="info" onClick={()=>{
                    if(Object.keys(checkedCollection).length > 0){
                        checkedCollection.time = timeCheckedin
                        checkedCollection.program = program
                        checkedCollection.setBy = currentUser
                        updateItem('/bulkupdatetimeclock',checkedCollection,[updateBulkTime, updateBulkHistory])
                    }
                    handleClose();
                }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )

}