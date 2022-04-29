import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Person, PersonPlus, BoxArrowRight, Gear, Bell} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { UserContext } from '../../store/StoreProvider';
import Notifications from '../notifications/Notifications';

const Header: React.FC = (): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);
    const [notis, setNotis] = useState<any[]>([]);

    const { user, setUser } = useContext(UserContext);
    const userLogged: boolean = Boolean(user);
    
    const navigate = useNavigate();

    const logout = async (): Promise<void> => {
        setUser(null);
        sessionStorage.removeItem("currentUser");
        await req.get('user/logout');
    }

    const handleShow = () => setShow(prev => !prev);     

    const checkNewNoti: boolean = notis.some((noti: any) => noti.toDisplay === true);

    useEffect(() => {
        const sse = new EventSource('http://localhost:5000/noti/sse', { withCredentials: true })

        function test(data: any) {
            setNotis(data.noti);
        }

        sse.onmessage = (e: any) => test(JSON.parse(e.data));
        return () => {
            sse.close();
          };
    },[])

    const bellColor: JSX.Element = checkNewNoti ? <Bell style={{color: 'red'}} /> : <Bell />;

    const handleRedirectToHome = () => navigate('');
    const handleRedirectToCommunicator = () => navigate('/komunikator');
    const handleRedirectToGames = () => navigate('/games');

    const handleRedirectToSettings = () => navigate('/ustawienia');

    const setPropertylabel: JSX.Element = user 
        ? 
        <Nav className="justify-content-end">
            <Notifications show={show} handleShow={handleShow} user={user} userLogged={userLogged} bellColor={bellColor} notis={notis}/>
            <OverlayTrigger placement='bottom' overlay={
                <Tooltip id='tooltip-bottom'>
                    Ustawienia
                </Tooltip>
            }>
                <Nav.Link onClick={handleRedirectToSettings}><Gear/></Nav.Link>                        
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
                    <Nav.Link onClick={handleRedirectToHome}>Forum</Nav.Link>
                    <Nav.Link onClick={handleRedirectToCommunicator}>Komunikator</Nav.Link>
                    <Nav.Link onClick={handleRedirectToGames}>Nuda?</Nav.Link>
                </Nav>
                {setPropertylabel}
            </Container>
        </Navbar>
    )
}

export default Header

