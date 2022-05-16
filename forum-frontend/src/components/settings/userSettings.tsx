import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import ChangePassword from '../changePassword/ChangePassword';
import PanelAdmin from '../panelAdmin/PanelAdmin';
import UserInformation from '../userInformation/UserInformation';

const UserSettings: React.FC = (): JSX.Element => {

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const handleRedirectToAdmin = () => navigate('admin');
    const handleRedirectToPassword = () => navigate('password');
    const handleRedirectToInfo = () => navigate('info');

    return (
        <>
            <Container>
                <Row className={`${theme.textColor} my-5`}>
                    <Col className="py-3 d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                        <p onClick={handleRedirectToInfo}>Informacje</p>
                    </Col>
                    <Col className="py-3 d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                        <p onClick={handleRedirectToPassword}>Zmiana hasła</p>
                    </Col>
                    { user?.role === 'admin' ?
                        <Col className="py-3  d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}}>
                            <p onClick={handleRedirectToAdmin}>Panel Administratora</p>
                        </Col> : null
                    }                    
                </Row>
                <Row>
                    <Routes>
                        <Route path='info' element={<UserInformation />} />
                        <Route path="password" element={<ChangePassword />} />
                        {user?.role === 'admin' ? <Route path="admin" element={<PanelAdmin />} /> : null}
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default UserSettings;