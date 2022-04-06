import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
import Home from '../home/Home';
import Register from '../register/Register';
import Topic from '../topic/Topic';
import TopicPosts from '../topicPosts/TopicPosts';

const Content: React.FC = (): JSX.Element => {

    return (
        <Container>
            <Row>
                <Col>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/:sectionID' element={<Topic />} />
                        <Route path='/sekcja/:topicID' element={<TopicPosts/>} />
                        <Route path='/rejestracja' element={<Register/>} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Content;