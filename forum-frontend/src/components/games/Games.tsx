import React, { useContext } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { ThemeContext } from '../../store/StoreProvider';

const Games: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const handleRedirectToSnake = () => navigate('/snake');

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className={`${theme.textColor} d-flex justify-content-center mt-5`}>Powiało nudą? Może chciałbyś zagrać w Snake'a? ;)</p>
                        <small className='d-flex justify-content-center'>Gra dostępna tylko w wersji dektopowej</small>
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <p className={`${theme.textColor} d-flex justify-content-center align-items-center my-5`}>
                            Popularna gra<Nav.Link onClick={handleRedirectToSnake} className='mx-1 text-warning'>Snake</Nav.Link>
                        </p>
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <p className={`${theme.textColor} d-flex justify-content-center m2-5`}>Graj i rywalizuj z innymi!</p>
                    </Col>
                </Row>                
            </Container>
        </>
    )
}

export default Games;