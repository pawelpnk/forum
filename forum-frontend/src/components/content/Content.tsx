import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
import { UserContext } from '../../store/StoreProvider';
import Games from '../games/Games';
import Home from '../home/Home';
import Login from '../login/Login';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import Register from '../register/Register';
import Snake from '../snake/Snake';
import Topic from '../topic/Topic';
import TopicPosts from '../topicPosts/TopicPosts';

const Content: React.FC = (): JSX.Element => {

    const { user } = useContext(UserContext);

    return (
        <Container>
            <Row>
                <Col>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/s/:sectionID' element={<Topic />} />
                        <Route path='/sekcja/:topicID' element={<TopicPosts/>} />
                        {!user && <Route path='/rejestracja' element={<Register/>} />}
                        {!user && <Route path='/zaloguj' element={<Login/>} />}
                        <Route path='/games' element={<Games />} />
                        <Route path='/snake' element={<Snake />} />
                        <Route path='/*' element={<NotFoundPage/>} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Content;