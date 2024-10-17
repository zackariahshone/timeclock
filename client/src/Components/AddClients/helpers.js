
import React, { useEffect, useState } from "react";
import { addEmployee} from "../../app/EmployeeListSlice";
import {
    Col,
    Row,
    Button,
    Modal
} from "react-bootstrap";
import { useDispatch } from 'react-redux';
import './style.css'
import { createItem } from "../../globalUtils/requests";

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


export const CreateStaffModal = ({ show, setShow, type }) => {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    const [empName, setEmpName] = useState();
    const [program, setProgramName] = useState();
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Enter New {toCapitalize(type)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                            <Row>
                                <Col>
                                  {toCapitalize(type)} Name:  <input
                                        placeholder="enter name"
                                        onBlur={(e) => {
                                            setEmpName(e.target.value)
                                        }}
                                    />
                                </Col>
                                <Col>
                                    Start Date: <input placeholder={new Date().toDateString()} />
                                </Col>
                              
                                <Col className="radioButtons">
                                    <div
                                        onChange={(e) => {
                                            setProgramName(e.target.value)
                                        }}>
                                        Program Name: 
                                        <br/>
                                        <input type="radio" value={`Richardson Industries`} name="program" /> Richardson Industries
                                        <br />
                                        <input type="radio" value={`Aspire`} name="program" /> Aspire
                                    </div>
                                </Col>
                            </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            if (empName && program) {
                                createItem('/createteacher',{
                                    name: empName,
                                    dateStarted: new Date().toDateString(),
                                    buildingName: program,
                                    group: `${program} ${type}}`,
                                    program,
                                    status: 'out',
                                    history: [],
                                    id: generateUniqueId(),
                                    type
                                },addEmployee,'');
                                // dispatch(addEmployee({
                                //     name: empName,
                                //     dateStarted: new Date().toDateString(),
                                //     buildingName: program,
                                //     group: `${program} ${type}}`,
                                //     program,
                                //     status: 'out',
                                //     history: [],
                                //     id: generateUniqueId(),
                                //     type
                                // }))
                                setEmpName('');
                            }
                            handleClose()
                        }}
                        variant="primary">
                        Create New {toCapitalize(type)}
                    </Button>
                    <Button
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
                    >dummy dump {type}</Button>
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
