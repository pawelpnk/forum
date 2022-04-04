import React from 'react';
import { Navbar, Container, Nav, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Person, PersonPlus} from 'react-bootstrap-icons';

const Header: React.FC = (): JSX.Element => {

    // const setPropertylabel = user ? 

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="forum">Forum</Nav.Link>
                    <Nav.Link href="komunikator">Komunikator</Nav.Link>
                    <Nav.Link href="games">Nuda?</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                    <OverlayTrigger placement='bottom' overlay={
                        <Tooltip id='tooltip-bottom'>
                            Zaloguj
                        </Tooltip>
                    }>
                        <Nav.Link href="zaloguj"><Person/></Nav.Link>                        
                    </OverlayTrigger>
                    <OverlayTrigger placement='bottom' overlay={
                        <Tooltip id='tooltip-bottom'>
                            Rejestracja
                        </Tooltip>
                    }>
                        <Nav.Link href="rejestracja"><PersonPlus/></Nav.Link>                        
                    </OverlayTrigger>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header

