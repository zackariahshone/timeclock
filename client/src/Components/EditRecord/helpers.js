import React from "react";
import { 
    Button,
    Col
 } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

import { EditRecord } from "./script";
import './style.css'
import { isAdmin } from "../../app/CurrentUserSlice";
import { useSelector } from "react-redux";

export function getPreviousSunday() {
    const now = new Date();
    
    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = now.getDay();
    
    // Calculate the difference in days to the previous Sunday
    const daysSinceSunday = currentDay; // If today is Sunday, go back 7 days
    
    // Create a new date for the previous Sunday
    const previousSunday = new Date(now);
    previousSunday.setDate(now.getDate() - daysSinceSunday);
    
    // Set time to the start of the day (00:00:00)
    previousSunday.setHours(0, 0, 0, 0);
    
    // Get the time in milliseconds
    return previousSunday.getTime();
  }

export  function EditItemModal({show, setShow, record, list}) {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const admin = useSelector(isAdmin)
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    return (
      <>
        <Modal 
            scrollable={true} 
            dialogClassName="my-modal" 
            show={show} 
            onHide={handleClose} 
            centered>
            <Modal.Title>{record.name}</Modal.Title>
          <Modal.Header closeButton>
            {daysOfWeek.map((day) => (
                        <Col>
                            <h4>{day}</h4>
                        </Col>
                    ))}
          </Modal.Header>
          <Modal.Body>
            <EditRecord admin={admin} record = {record} list = {list}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
