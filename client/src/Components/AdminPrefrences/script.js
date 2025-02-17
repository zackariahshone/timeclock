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
import { updateItem } from "../../globalUtils/requests";
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
    console.log(custPrefs);
    
    console.log(valueChange);

    return (
        <>
            <div className="adminPrefs">
                <h1>Custom Preferences</h1>
                <div className="lineDivider">
                    <p className="adminPrefs"> Auto Clockout</p>
                    <div>
                        <input
                            onChange={(e) => {
                                setValueChange({ ...valueChange, 'autoClockoutTime': {  ...valueChange?.autoClockoutTime,'time': e.target.value }})
                            }}
                            className={'numberStyle'}
                            defaultValue={5}
                            type="number" />
                        <select
                            onChange={(e) => {
                                console.log(e);
                                setValueChange({ ...valueChange, 'autoClockoutTime': { ...valueChange?.autoClockoutTime,'timeOfDay': e.target.value }})
                            }}
                        >
                            <option>am</option>
                            <option>pm</option>
                        </select>
                    </div>
                </div>

                <div className="lineDivider">
                    <p className="adminPrefs"> Lock Editing : {`${'editingLocked'}`}</p>
                    <input
                        onClick={(e) => {
                            setValueChange({ ...valueChange, 'lockEditing': e.target.checked })
                        }}
                        type="checkbox"
                    />
                </div>
                <div className="lineDivider">

                    <p className="adminPrefs"> Target Time</p>
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
                                console.log(valueChange.earlyLeaveReasons);
                                setValueChange( {...valueChange,'earlyLeaveReasons': valueChange.earlyLeaveReasons == null ?  [newReason] : [...valueChange?.earlyLeaveReasons, newReason]});
                                setNewReason('');
                            }}>
                            Add New Reason
                        </Button>
                    </InputGroup>


                    <ListGroup variant="flush">
                        {earlyLeaveReason?.map((reason) => (
                            <>
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <Badge> {reason} </Badge>
                                    <Badge className="delete" bg="danger" >
                                        X
                                    </Badge>
                                </ListGroup.Item>
                            </>
                        ))}
                    </ListGroup>
                </div>
            </div>
            <Button
                variant="info"
                onClick={()=>{
                    updateItem('/setpreferences_V2', valueChange, setPrefs_V2)
                }}
            >Save Changes</Button>
        </>
    )
}