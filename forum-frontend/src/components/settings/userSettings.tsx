import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import PanelAdmin from '../panelAdmin/PanelAdmin';

const UserSettings: React.FC = (): JSX.Element => {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const handleRedirectToAdmin = () => navigate('admin');

    return (
        <>
            <Container>
                <Row className={`${theme.textColor} my-5`}>
                    { user?.role === 'admin' ?
                        <Col className="py-3  d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                            <p onClick={handleRedirectToAdmin}>Panel Administratora</p>
                        </Col> : null
                    }
                    <Col className="py-3 d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                        <p>Zmiana hasła</p>
                    </Col>
                    <Col className="py-3 d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                        <p>Ustaw avatar</p>
                    </Col>
                </Row>
                <Row>
                    <Routes>
                        {user?.role === 'admin' ? <Route path="admin" element={<PanelAdmin />} /> : null}
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default UserSettings;