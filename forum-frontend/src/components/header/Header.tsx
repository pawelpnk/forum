import React, { useContext, useState } from 'react';
import { Navbar, Container, Nav, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Person, PersonPlus, BoxArrowRight, Gear, Bell} from 'react-bootstrap-icons';
import { UserContext } from '../../store/StoreProvider';
import Notifications from '../notifications/Notifications';

const Header: React.FC = (): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);

    const { user, setUser } = useContext(UserContext);
    const userLogged: boolean = Boolean(user);

    const logout = (): void => {
        setUser(null);
        sessionStorage.removeItem("currentUser");
    }

    const handleShow = () => setShow(prev => !prev);

    const setPropertylabel: JSX.Element = user 
        ? 
        <Nav className="justify-content-end">
            <Notifications show={show} handleShow={handleShow} user={user} userLogged={userLogged}/>
            <OverlayTrigger placement='bottom' overlay={
                <Tooltip id='tooltip-bottom'>
                    Ustawienia
                </Tooltip>
            }>
                <Nav.Link href="/ustawienia"><Gear/></Nav.Link>                        
            </OverlayTrigger>
            <OverlayTrigger placement='bottom' overlay={
                <Tooltip id='tooltip-bottom'>
                    Wyloguj
                </Tooltip>
            }>
                <Button variant='dark' onClick={logout}><BoxArrowRight/></Button>                        
            </OverlayTrigger>
        </Nav>
        :
        <Nav className="justify-content-end">
            <OverlayTrigger placement='bottom' overlay={
                <Tooltip id='tooltip-bottom'>
                    Zaloguj
                </Tooltip>
            }>
                <Nav.Link href="/zaloguj"><Person/></Nav.Link>                        
            </OverlayTrigger>
            <OverlayTrigger placement='bottom' overlay={
                <Tooltip id='tooltip-bottom'>
                    Rejestracja
                </Tooltip>
            }>
                <Nav.Link href="/rejestracja"><PersonPlus/></Nav.Link>                        
            </OverlayTrigger>
        </Nav>


    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/">Forum</Nav.Link>
                    <Nav.Link href="/komunikator">Komunikator</Nav.Link>
                    <Nav.Link href="/games">Nuda?</Nav.Link>
                </Nav>
                {setPropertylabel}
            </Container>
        </Navbar>
    )
}

export default Header

