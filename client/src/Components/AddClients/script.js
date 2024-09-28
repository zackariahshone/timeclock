import React from "react";
import {
    Container,
    Card,
    Col,
    Row
} from "react-bootstrap";

const emps = [
    {
        name: 'one',
        dateStarted: '10/10/24',
    },
    {
        name: 'two',
        dateStarted: '10/10/24',
    },
    {
        name: 'three',
        dateStarted: '10/10/24',
    },
    {
        name: 'four',
        dateStarted: '10/10/24',
    },
]

export default (props) => {
    return (
        <Container>
            <Col>
                <Row>
                    <Col>
                        enter new employee
                    </Col>
                    <Col>
                        <input />
                    </Col>
                    <Col>
                        <button />
                    </Col>
                </Row>

            </Col>
            <Col>
                <Row>
                    {emps.map((employee) => (
                        <Col>
                            <Card body>
                                <p>{employee.name}</p>
                                <p>{employee.dateStarted}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Container>
    )
}