import React from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';

const Games: React.FC = (): JSX.Element => {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className='text-light d-flex justify-content-center mt-5'>Powiało nudą? Może chciałbyś zagrać w Snake'a? ;)</p>
                        <small className='d-flex justify-content-center'>Gra dostępna tylko w wersji dektopowej</small>
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <p className='text-light d-flex justify-content-center align-items-center my-5'>
                            Popularna gra<Nav.Link href='snake' className='mx-1' style={{color: 'yellow'}}>Snake</Nav.Link>
                        </p>
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <p className='text-light d-flex justify-content-center m2-5'>Graj i rywalizuj z innymi!</p>
                    </Col>
                </Row>                
            </Container>
        </>
    )
}

export default Games;