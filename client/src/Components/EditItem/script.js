import React, { useState } from "react";
import {
  Button,
  Modal,
  Row
} from "react-bootstrap";
import { toCapitalize } from "../AddClients/helpers";
import DatePicker from "react-datepicker";
import { updateItem } from "../../globalUtils/requests";

export const EditItem = ({ show, setShow, employee }) => {
  const programs = ['Aspire', 'Richardson Industries']
  const handleClose = () => setShow(false);
  const editableKeys = Object.keys(employee)
  const [updates, setUpdates] = useState({});  
  const [programCheckBox, setProgramCheckBox] = useState({});
  
  const sanitizeData = (data)=>{
    const keys = Object.keys(data)
    keys.forEach((key)=>{      
      if(data[key]){

      }
    })
  }

  const handleSubmit = () =>{
    let updatesToSubmit = {...updates}
    if(programCheckBox){
      let prgObj = {}
      const prgKeys = Object.keys(programCheckBox)      
      prgKeys.forEach(prg=>{
          console.log(programCheckBox[prg]);
          if(programCheckBox[prg]){
            prgObj[prg] = 'out'
          }else{
            prgObj[prg] = 'inactive'
          }
          })
      updatesToSubmit.programs = { ...employee.programs,...prgObj}
    }    
    updateItem('/updateitem',{'idUpdate':employee.id,'updates':{...updatesToSubmit}})
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{employee.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {editableKeys.map((key) => {
              if ((key !== '_id' &&
                key !== '__v') &&
                key != 'status' &&
                key.toLowerCase() != 'type'
              ) {
                if (typeof employee[key] != 'string') {
                  let subItemKeys = Object.keys(employee[key])
                  if(key == "programs"){
                    subItemKeys = programs;
                  }                  
                  return (
                    <>
                      {
                        subItemKeys.map((subKey) => {
                          switch (key) {
                            case 'programs':
                              let checked = employee[key][subKey] ? true : false                              
                              return (
                                <>
                                  <label for={subKey}>{toCapitalize(subKey)}</label>
                                  <input 
                                    defaultChecked={checked}
                                    onChange={(e)=>{
                                      setProgramCheckBox({...programCheckBox,[subKey]:e.target.checked})
                                    }}
                                  type="checkbox" id={subKey} placeholder={`${employee[key][subKey]}`}></input>
                                </>
                              )
                            case 'admissionDates':
                              return (
                                <>
                                  <label for={key}>{toCapitalize(key).slice(0, -1)} : {subKey}</label>
                                  <DateEdits datakey = {key} dataSubkey = {subKey} date={employee[key][subKey]} updates={updates} setUpdates={setUpdates} />
                                </>
                              )
                            default:
                              return (<>notthing reached</>)
                          }
                        })
                      }
                    </>
                  )
                } else {
                  return (
                    <>
                      <label for={key}>{toCapitalize(key)}</label>
                      <input onChange={(e)=>{
                        setUpdates({...updates,[key]:e.target.value})
                        }}
                       id={key} placeholder={`${employee[key]}`}></input>
                    </>
                  )
                }
              }
            })}

          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" 
                  onClick={handleSubmit}
                  >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
}

const DateEdits = ({ datakey, dataSubkey,date, updates, setUpdates }) => {
  
  
  const [admissionDate, setAdmissionDate] = useState(date);
  function handleChangeDate(date, event) {
    if(!updates.admissionDates){
        setUpdates({...updates,['admissionDates']:{}})
    }

    setAdmissionDate(new Date(date).getTime());
    setUpdates({...updates,'admissionDates':{ ...updates.admissionDates, [dataSubkey]:admissionDate}})
  }
  return (< DatePicker
    selected={admissionDate}
    onChange={handleChangeDate} />
  )
}