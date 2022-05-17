import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import Ranking from '../ranking/Ranking';

export interface RankingI {
    id: string;
    name: string;
    numberPoints: number;
    userLogin?: string | null;
}

const Games: React.FC = (): JSX.Element => {
    const [topScore, setTopScore] = useState<RankingI[] | []>([]);
    const [topScoreUser, setTopScoreUser] = useState<RankingI[] | []>([]);

    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const handleRedirectToSnake = () => navigate('/snake');

    const topScoreFetch = async (): Promise<void> => {
        try {
            const data = await req.get('game/all');
            setTopScore(data.data);
        } catch {
            console.log("Błąd pobrania wyników");
        }            
    };

    const topScoreUserFetch = async (): Promise<void> => {
        if(user) {
            const data = await req.get(`game/top-user`);
            setTopScoreUser(data.data);
        };
    };   

    useEffect(() => {
        topScoreFetch();
        topScoreUserFetch();
    },[]);

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className={`${theme.textColor} d-flex justify-content-center mt-5`}>Powiało nudą? Może chciałbyś zagrać w Snake'a? ;)</p>
                        <small className='d-flex justify-content-center text-muted'>Gra dostępna tylko w wersji dektopowej</small>
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
                    { user ? 
                        <Col xs={12} sm={6}>
                            <Ranking score={topScoreUser}/>
                        </Col>
                        : null
                    }                    
                </Row>           
            </Container>
        </>
    )
}

export default Games;