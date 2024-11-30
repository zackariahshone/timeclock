
import React, { useEffect, useState } from "react";
import { addEmployee } from "../../app/EmployeeListSlice";
import {
    Col,
    Row,
    Button,
    Modal,
    Form
} from "react-bootstrap";
import { useDispatch } from 'react-redux';
import './style.css'
import { createItem } from "../../globalUtils/requests";

export const CreateStaffModal = ({ show, setShow, type }) => {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    const [empName, setEmpName] = useState();
    const [empID, setEmpId] = useState();
    const [program, setProgramName] = useState();
    const [admin, setAdmin] = useState(false);
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Enter New {toCapitalize(type)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {/* <Row> */}
                    <Row>
                        {toCapitalize(type)} Name:  <input
                            placeholder="enter name"
                            onBlur={(e) => {
                                setEmpName(e.target.value)
                            }}
                        />
                    </Row>
                    <Row>
                        Start Date: <input placeholder={new Date().toDateString()} />
                    </Row>
                    <Row>
                        ID Number: <input
                            placeholder="Enter ERC ID"
                            onBlur={(e) => {
                                setEmpId(e.target.value)
                            }} />
                    </Row>
                    <Row className="radioButtons">
                    <div>

                        <Form
                            onChange={(e) => {
                                setProgramName(e.target.value)
                            }}>
                            Program Name:
                            <br />
                            <input type="radio" value={`Richardson Industries`} name="program" /> Richardson Industries
                            <br />
                            <input type="radio" value={`Aspire`} name="program" /> Aspire
                        </Form>
                    </div>
                    </Row>
                    {type == 'teacher' ? 
                    <Row>
                    <div>
                        <Form
                            onChange={(e) => {
                                setAdmin(e.target.value)
                            }}>
                            Admin:
                            <br />
                            <input type="radio" value={false} name="admin" /> false
                            <br />
                            <input type="radio" value={true} name="admin" /> true
                        </Form>
                    </div>
                    </Row>:''}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            if (empName && program) {
                                let createitemOBJ =  {
                                    name: empName,
                                    dateStarted: new Date().toDateString(),
                                    buildingName: program,
                                    group: `${program} ${type}}`,
                                    program,
                                    status: 'out',
                                    id: empID ? empID : generateUniqueId(),
                                    type,
                                }
                                if(type == 'teacher') {createitemOBJ.admin = admin};
                                createItem(`/create${type}`, createitemOBJ, addEmployee, '');
                                setEmpName('');
                            }
                            handleClose()
                        }}
                        variant="primary">
                        Create New {toCapitalize(type)}
                    </Button>
                    {/* <Button
                        variant="danger"
                        onClick={() => {
                            {
                                (type.toLowerCase() == 'employee' ? clientDummyNames : ContractorDummynames).forEach((name, i) => {
                                    dispatch(addEmployee({
                                        name: name,
                                        dateStarted: new Date().toDateString(),
                                        buildingName: i % 2 == 0 ? 'Aspire' : 'Richardson Industries',
                                        program: i % 2 == 0 ? 'Aspire' : 'Richardson Industries',
                                        group: i % 2 == 0 ? `Aspire ${toCapitalize(type)}` : `Richardson Industries ${toCapitalize(type)}`,
                                        status: 'out',
                                        history: [],
                                        id: generateUniqueId(),
                                        type
                                    }))
                                })
                            }
                        }}
                    >dummy dump {type}</Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export function generateUniqueId() {
    // Using the built-in crypto API for true randomness 
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);

    // Convert to a hex string
    const hexString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');

    return hexString;
}

export function toCapitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

