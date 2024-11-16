import React, { Fragment, useState } from "react";
import {
    Col,
    Container,
    Dropdown,
    Form,
    InputGroup,
    Row,
    Button
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { teachers } from "../../app/EmployeeListSlice";
import { Calendar } from "primereact/calendar";
import { getData } from "../../globalUtils/requests";
import { exportData, setExportData } from "../../app/ExportData";
const dropDowns = [{ "Programs": ['Aspire', "Richardson Industries"] }]
export const Billing = () => {
    const [dates, setDates] = useState()
    const [filters, setFilters] = useState({});
    const dataForExport = useSelector(exportData);
    console.log(dataForExport);

    return (
        <Container>
            <h1>Billing</h1>
            <Container>
                <Row>
                    <Col xs={2}>
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                {filters?.program ? filters.program : 'Select a Program'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                onClick={(e) => {
                                    console.log(e.target.textContent)
                                    setFilters({ ...filters, 'program': e.target.textContent })
                                }}
                            >
                                <Dropdown.Item href="#/action-1">Aspire</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Richardson Industries</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs={12} md={6}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Start and End Filters</InputGroup.Text>
                            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />
                            <Button
                                onClick={() => {
                                    const url = `/reports?start=${new Date(dates[0]).getTime()}&end=${new Date(dates[1]).getTime()}&building=${filters.program}`
                                    console.log(new Date(dates[0]).getTime())
                                    getData(url, 'GET', setExportData)
                                }}
                                variant='info'> Submit Filters </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
            {dataForExport != null ?
                <>
                    <Row>
                        {Object.keys(dataForExport[0]).map((key) => {
                            return (
                                <Col>{key}</Col>
                            )
                        })}
                    </Row>
                    <Row>
                        {
                            dataForExport.map((doc)=>{
                                const values = Object.values(doc);
                                return(
                                    <Row>
                                        {values.map((colVal)=> <Col>{colVal}</Col>)}
                                    </Row>
                                )
                            })
                        }
                    </Row>
                </>
                : ''
            }
        </Container>
    )
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
));

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

export const ProgramList = ({ setSignedIn, setSignInName }) => {
    const teachersList = useSelector(teachers);
    const dispatch = useDispatch()
    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Select From Teacher List:
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {dropDowns[0].Programs.map((program, key) => (
                    <Dropdown.Item
                        onClick={() => { }}
                        eventKey={key}>{program}</Dropdown.Item>

                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}