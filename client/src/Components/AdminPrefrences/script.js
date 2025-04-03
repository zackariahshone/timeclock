import React, { Fragment, useState } from "react";
import { prefs, Renderinputs } from "./helpers";
import {
    Button,
    Row,
    Col,
    InputGroup,
    Form,
    ListGroup,
    Badge
} from "react-bootstrap";
import { deleteItem, updateItem } from "../../globalUtils/requests";
import './style.css'
import { setPrefs,setPrefs_V2, customPrefs } from "../../app/PreferencesSlice";
import { useSelector } from "react-redux";
export const AdminPrefrences = () => {
    const custPrefs = useSelector(customPrefs)
    const [prefUpdate, setPrefUpdate] = useState()
    const priorityPrefs = custPrefs ? custPrefs : prefs

    return (
        <Fragment>
            <h1>Admin Preferences</h1>
            {
                priorityPrefs.map((pref) => (
                    <Row>
                        <Col>
                            <div className="adminPrefs">
                                <Renderinputs prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} />

                            </div>
                        </Col>
                        <hr />
                    </Row>
                ))
            }
            <Col xs={{ span: 10, offset: 4 }}>
                <Button
                    onClick={() => {
                        updateItem('/setpreferences', prefUpdate, setPrefs)
                    }}
                    className="savePrefsButton">Save Changes</Button>
            </Col>
        </Fragment>
    )
}


export const AdminPrefrences_V2 = () => {

    const [valueChange, setValueChange] = useState({});
    const [earlyLeaveReason, setEarlyLeaveReason] = useState([]);
    const [newReason, setNewReason] = useState();
    const custPrefs = useSelector(customPrefs)
    
    const autoOutPref =  custPrefs.find((pref)=> pref.id == 'autoClockoutTime')?.value || {'time':5,'timeOfDay':'pm'}
    const targetTimePref = custPrefs.find((pref)=> pref.id == 'targetTime')?.value || 5
    const earlyLeaveReasonsPrefs = custPrefs.find((pref)=> pref.id == 'earlyLeaveReasons')?.value
    const lockEditingPref = custPrefs.find((pref)=> pref.id == 'lockEditing')?.value || false
    
    return (
        <>
            <div className="adminPrefs">
                <h1>Custom Preferences</h1>
                <div className="lineDivider">
                    <p className="adminPrefs"> Auto Clockout Set For <span className="displayValue">{autoOutPref.time} {autoOutPref.timeOfDay}</span></p>
                    <div>
                        <input
                            onChange={(e) => {
                                setValueChange({ ...valueChange, 'autoClockoutTime': {  ...valueChange?.autoClockoutTime,'time': e.target.value }})
                            }}
                            className={'numberStyle'}
                            defaultValue={autoOutPref.time < 0 ? 5 : autoOutPref.time}
                            // value={autoOutPref.time}
                            type="number" />
                        <select
                            defaultValue={'select time of day'}
                            onChange={(e) => {
                                setValueChange({ ...valueChange, 'autoClockoutTime': { ...valueChange?.autoClockoutTime,'timeOfDay': e.target.value }})
                            }}
                        >
                            <option defaultValue={'select time of day'} disabled = {true}>select time of day</option>
                            <option>am</option>
                            <option>pm</option>
                        </select>
                    </div>
                </div>

                <div className="lineDivider">
                    <p className="adminPrefs"> Lock Editing : <span className="displayValue">{lockEditingPref ? 'true' : 'false' }</span> </p>
                    <input
                        onClick={(e) => {
                            setValueChange({ ...valueChange, 'lockEditing': e.target.checked })
                        }}
                        type="checkbox"
                        defaultChecked={lockEditingPref}
                    />
                </div>
                <div className="lineDivider">

                    <p className="adminPrefs"> Target Time Set For <span className="displayValue" >{targetTimePref} hrs</span></p>
                    <input
                        className={'numberStyle'}
                        defaultValue={5}
                        type="number"
                        onClick={(e) => {
                            setValueChange({ ...valueChange, 'targetTime': e.target.value })
                        }}
                    />
                </div>
                <div className="lineDivider">
                    <p className="adminPrefs"> Early Clockout List</p>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Reason For Early Leave"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => {
                                setNewReason(e.target.value)
                            }}
                            value={newReason}
                        />
                        <Button
                            variant="outline-secondary"
                            id="button-addon2"
                            onClick={() => {
                                setEarlyLeaveReason([...earlyLeaveReason, newReason])
                                setValueChange( {...valueChange,'earlyLeaveReasons': valueChange.earlyLeaveReasons == null ?  [newReason] : [...valueChange?.earlyLeaveReasons, newReason]});
                                setNewReason('');
                            }}>
                            Add New Reason
                        </Button>
                    </InputGroup>


                    <ListGroup horizontal>
                        {earlyLeaveReasonsPrefs?.map((reason) => (
                            <>
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <Badge> {reason} </Badge>
                                    <Badge 
                                        className="delete" 
                                        bg="danger" 
                                        onClick={()=>{
                                            deleteItem('/deleteearlyClockoutReason',{reason}, setPrefs_V2)
                                        }}
                                        >
                                        X
                                    </Badge>
                                </ListGroup.Item>
                            </>
                        ))}
                        {earlyLeaveReason.length > 0 ?
                    earlyLeaveReason?.map((reason) => (
                        <>
                            <ListGroup.Item
                                className="d-flex justify-content-between align-items-start"
                            >
                                <Badge> {reason} </Badge>
                                <Badge 
                                    className="delete" 
                                    bg="danger" 
                                    onClick={()=>{
                                        deleteItem('/deleteearlyClockoutReason',{reason}, setPrefs_V2)
                                    }}
                                    >
                                    X
                                </Badge>
                            </ListGroup.Item>
                        </>
                    ))
                    :<></>    
                    }
                    </ListGroup>
                </div>
            </div>
            <Button
                variant="info"
                disabled = {!Object.keys(valueChange).length}
                onClick={()=>{
                    updateItem('/setpreferences_V2', valueChange, setPrefs_V2)
                    setEarlyLeaveReason('');
                    setValueChange('');
                }}
            >Save Changes</Button>
        </>
    )
}