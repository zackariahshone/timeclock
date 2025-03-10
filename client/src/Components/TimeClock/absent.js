import React, { useState } from "react";
import {
    Form,
    Card,
    Row,
    Col,
    InputGroup,
    Button,
    Modal,
    Dropdown
} from "react-bootstrap";
import { createItem } from "../../globalUtils/requests";


export const Absent = ({absentData, show, setShow, studentName }) => {
    const [absentReason, setAbsentReason] = useState();
    const handleClose = () => setShow(false);

    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> {studentName} Reason For Absence</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                            onChange={(e)=>{
                                setAbsentReason(e.target.value)
                            }}
                            as="textarea" 
                            rows={3} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={()=>{
                        absentData['absentReason'] = absentReason
                         createItem('/studenttimeclock', absentData);
                        // handleClose()
                    }}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}