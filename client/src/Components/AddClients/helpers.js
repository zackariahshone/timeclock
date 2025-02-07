
import React, { Fragment, useState } from "react";
import { addEmployee } from "../../app/EmployeeListSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Row,
    Button,
    Modal,
    Form
} from "react-bootstrap";
import './style.css'
import { createItem } from "../../globalUtils/requests";
import { BulkLoad } from "./bulkLoad";

export const CreateStaffModal = ({ show, setShow, type, bulk }) => {

    const handleClose = () => setShow(false);
    const [empName, setEmpName] = useState();
    const [empID, setEmpId] = useState();
    const [program, setProgramName] = useState();
    const [admissionDate, setAdmissionDate] = useState(new Date().getTime());
    const [programs, setPrograms] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [pincode, setPincode] = useState()
    function handleChangeDate(date, event){
        setAdmissionDate(new Date(date).getTime());        
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Enter New {toCapitalize(type)}</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                   { !bulk? 
                   <>
                   
                   <Row>
                        {toCapitalize(type)} Name:  <input
                            placeholder="enter name"
                            onBlur={(e) => {
                                setEmpName(e.target.value)
                            }}
                        />
                    </Row>
                    <Row>
                        Admission Date:
                             <DatePicker
                                selected={admissionDate}
                                onChange={handleChangeDate}
                            />
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
                                    if (e.target.checked) {
                                        setProgramName(e.target.value)
                                        setPrograms([...programs, e.target.value])
                                    }
                                }}>
                                Program Name:
                                <br />
                                <input type="checkbox" value={`Richardson Industries`} name="program" /> Richardson Industries
                                <br />
                                <input type="checkbox" value={`Aspire`} name="program" /> Aspire
                            </Form>
                        </div>
                    </Row>
                    </>
                    :
                    <BulkLoad />    
                }
                    {type == 'teacher' ?
                    <Fragment>

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
                        </Row> 
                        <Row>
                            Pincode: <input
                             onBlur={(e) => {
                                setPincode(e.target.value)
                            }}
                            />
                        </Row>
                        </Fragment>
                        : ''}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            const admissDates = getAdmissionDates(programs, admissionDate);
                            
                            if (empName && program) {
                                let createitemOBJ = {
                                    name: empName,
                                    admissionDates:admissDates,
                                    programs: getProgramStatus(programs),
                                    status: 'out',
                                    id: empID ? empID : generateUniqueId(),
                                    type,
                                    active:true
                                }
                                
                                if (type == 'teacher') { 
                                    createitemOBJ.program = program
                                    createitemOBJ.admin = admin 
                                    createitemOBJ.pin = pincode
                                };
                                createItem(`/create${type}`, createitemOBJ, addEmployee, '');
                                setEmpName('');
                            }
                            handleClose()
                        }}
                        variant="primary"> 
                        Create New {toCapitalize(type)}
                    </Button>
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
export function getProgramStatus(programs) {
    let StatusObject = {}
    programs.forEach(program => {
        StatusObject[program] = 'out';
    })
    return StatusObject;
}

function getAdmissionDates(programs, admissionDates) {
    let admissObject ={};
    programs.forEach((prog) => {
        admissObject[prog] = admissionDates;
    })
    return admissObject
}

