import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import Ranking from '../ranking/Ranking';

const Games: React.FC = (): JSX.Element => {
    const [topScore, setTopScore] = useState<any>([]);
    const [topScoreUser, setTopScoreUser] = useState<any>([]);

    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const handleRedirectToSnake = () => navigate('/snake');

    useEffect(() => {
        const topScore = async (): Promise<void> => {
            const data = await req.get(`game/top`);
            setTopScore(data.data);
        };

        const topScoreUser = async (): Promise<void> => {
            if(user) {
                const data = await req.get(`game/top-user`);
                setTopScoreUser(data.data);
            };
        };

        topScore();
        topScoreUser();
    },[]);

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
                <Row>
                    <Col xs={12} sm={6}>
                        <Ranking score={topScore}/>
                    </Col>
                    <Col xs={12} sm={6}>
                        {user ? <Ranking score={topScoreUser}/> : null }
                    </Col>
                </Row>           
            </Container>
        </>
    )
}

export default Games;