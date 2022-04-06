import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import req from '../../helpers/request';

interface TopicType {
    id: string;
    sectionId: string;
    topic: string;
    createdAt: string;
    updateAt: string;
    userId: string | null;
}

const Topic: React.FC = (): JSX.Element => {
    const [topics, setTopics] = useState<TopicType[]>([]);

    const { sectionID } = useParams()
    const navigate = useNavigate();

    const fetchTopics = async (): Promise<void> => {
        const data = await req.get(`/topic/all/${sectionID}`);
        setTopics(data.data)
        console.log(data.data);
    }

    useEffect(()=> {
        fetchTopics();
    }, []);

    const handleRedirectToTopicWithPosts = (topic: TopicType) => {
        localStorage.setItem("currentTopic", JSON.stringify(topic));
        navigate(`/${topic.id}`);
    }

    return (
        <Container className='my-5 text-light'>
            <p>{JSON.parse(localStorage.getItem("currentSection") || "null").sectionName}</p>
            {topics.map((topic: any) => {
                return (
                    <Row key={topic.id} className='border py-1'>
                        <Col className='py-1'>
                            <Container>
                                <Row>
                                    <Col>
                                        <Nav.Link className='text-light' onClick={() => handleRedirectToTopicWithPosts(topic)}>{topic.topic}</Nav.Link>
                                    </Col>
                                    <Col>
                                        <p className='d-flex justify-content-end text-muted '><small>{topic.updatedAt}</small></p>
                                    </Col>
                                </Row>
                                <Row>
                                    <p className='py-0 text-white-50'>
                                        <small>{topic.userId 
                                        ? `Stworzony przez ${topic.userId} ${topic.createdAt}` 
                                        : `Stworzony przez nie istniejące konto ${topic.createdAt}`}
                                        </small>
                                    </p>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    )
                })
            }         
        </Container> 
    )
}

export default Topic;