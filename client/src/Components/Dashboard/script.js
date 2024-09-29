import React, { Fragment } from "react";
import { Col,Container,Row, Card } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';

export default (props)=>{
    const employeeList = useSelector((state) => state.employeeList.employees)
    console.log(employeeList.length);
    let empCount = 0;
    return(
        <Fragment>

            <h1>Insight</h1>

            <Container>
                <Row>
                    <Col>
                        <Card> 
                            <h3>Number of Clients</h3>
                            <p>{employeeList.length}</p>
                        </Card>
                    </Col>
                    <Col>
                       <Card> 
                            <h3>Clients Clocked In</h3>
                            {employeeList.forEach(emp=>{
                                if(emp.status == 'in'){
                                    empCount += 1;
                                }
                            })}
                            <p>{empCount}</p>
                        </Card> 
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card>
                            <h3>Percentage Of Employees Clocked In</h3> 
                            <b>{empCount/employeeList.length * 100}%</b>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}