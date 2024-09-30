import React, { Fragment } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
export default (props) => {
    const employeeList = useSelector((state) => state.employeeList.employees)
    console.log(employeeList.length);
    let empCount = 0;
    return (
        <Fragment>

            <h1>Insight</h1>

            <Container>
                <Row className="marginBottom">
                    <Col >
                        <Card>
                            <h3>Number of Clients</h3>
                            <p>{employeeList.length}</p>
                        </Card>
                    </Col>
                    <Col >
                        <Card>
                            <h3>Clients Clocked In</h3>
                            {employeeList.forEach(emp => {
                                if (emp.status == 'in') {
                                    empCount += 1;
                                }
                            })}
                            <p>{empCount}</p>
                        </Card>
                    </Col>
                </Row>
                <Row className="marginBottom">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card>
                            <h3>Percentage Of Employees Clocked In</h3>
                            <b>{Number(empCount / employeeList.length * 100).toFixed(2)}%</b>
                        </Card>
                    </Col>
                </Row>
                <Card>
                <Row className="marginBottom">
                    <Col>
                        <h3 id = 'clockedIn'>Clocked In</h3>
                        { getEmployeeStatus('in',employeeList)?.map(emp=>(<li>{emp.name}</li>))}
                    </Col>
                    <Col>
                        <h3 id = 'clockedOut'>Clocked Out</h3>
                        { getEmployeeStatus('out',employeeList)?.map(emp=>(<li>{emp.name}</li>))}
                    </Col>
                </Row>
                </Card>
            </Container>
        </Fragment>
    )
}

function getEmployeeStatus(status, employees) {
    switch (status) {
        case 'in':
          
            return  employees.filter((employee)=>(employee.status == 'in'));
        case 'out':
          
            return  employees.filter((employee)=>(employee.status == 'out'));
        default:
            return;
    }
}