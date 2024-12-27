import React from "react";
import { 
    Button,
    Modal,
    Row
} from "react-bootstrap";
import { toCapitalize } from "../AddClients/helpers";


export const EditItem = ({show, setShow,employee})=>{
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const editableKeys = Object.keys(employee)
    return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{employee.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>

                    {editableKeys.map((key)=>(
                        <>
                        <label for={key}>{toCapitalize(key)}</label>
                        <input id={key} placeholder={`${employee[key]}`}></input>
                        </>
                    ))}
                
                    </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
}