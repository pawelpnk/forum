import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
import Home from '../home/Home';
import Topic from '../topic/Topic';
import TopicPosts from '../topicPosts/TopicPosts';

const Content: React.FC = (): JSX.Element => {

    return (
        <Container>
            <Row>
                <Col>
                    <Routes>
                        <Route path='/' element={<Home />}/>
                        <Route path='/:sectionID' element={<Topic />}/>
                        <Route path='/:topicID' element={<TopicPosts/>}/>
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Content;