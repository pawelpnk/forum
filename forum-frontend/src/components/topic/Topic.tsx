import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import ModalInfo from '../modal/ModalInfo';
import ModalConfirm from '../modalConfirm/modalConfirm';
import ModalTopic from '../modalTopic/ModalTopic';

interface TopicType {
    id: string;
    sectionId: string;
    sectionName: string;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    lastPostUser: string;
    countPostsTopic: number;
}

const Topic: React.FC = (): JSX.Element => {
    const [topics, setTopics] = useState<TopicType[]>([]);
    const [showModalTopic, setShowModalTopic] = useState<boolean>(false);
    const [showModalInfo, setShowModalInfo] = useState<boolean>(false);
    const [topicName, setTopicName] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [firstPost, setFirstPost] = useState<string>('');
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [topicId, setTopicId] = useState<string>('');

    const { sectionID } = useParams()
    const navigate = useNavigate();

    const { user } = useContext(UserContext);
    const userLogged: boolean = Boolean(user);
    const { theme } = useContext(ThemeContext);

    const fetchTopics = async (): Promise<void> => {
        const data = await req.get(`/topic/all/${sectionID}`);
        setTopics(data.data);    
    }

    useEffect(()=> {
        fetchTopics();
    }, [showModalInfo]);

    const handleRedirectToTopicWithPosts = (topic: TopicType) => navigate(`/sekcja/${topic.id}`);
    const handleAddNewTopic = () => setShowModalTopic(true);
    const closeModalTopic = () => setShowModalTopic(false);
    const handleNewTopicArea = (event: ChangeEvent<HTMLInputElement>) => setTopicName(event.target.value);
    const handleAddFirstPost = (e: ChangeEvent<HTMLInputElement>) => setFirstPost(e.target.value);

    const validateInputs = (): boolean => {
        if(!topicName || !firstPost) {
            return false;
        }
        return true;
    }

    const handleAddTopicPost = async (): Promise<void> => {
        if(validateInputs()) {
            setShowModalTopic(false);
            setShowModalInfo(true);
            const result = await req.post(`topic/new`, {
                topic: topicName,
                sectionId: sectionID,
                userLogin: user.login,
                firstPost
            });
            setText(result.data.message);
        }
    }

    const closeModalInfo = () => {
        setShowModalInfo(false);
        setText('');
        setTopicName('');
        setFirstPost('');
        setTopicId('');
    }

    const handleShowModalDeleteTopic = (id: string) => {
        setShowModalConfirm(true);
        setTitle('Czy na pewno chcesz usunąć ten temat wraz z jego postami?');
        setTopicId(id);
    }

    const closeModalConfirm = () => {
        setShowModalConfirm(false);
        setTopicId('');
    }

    const handleDeleteTopic = async (): Promise<void> => {
        const result = await req.delete(`topic/delete/${topicId}`)
        setTopicId('');
        setShowModalConfirm(false);
        setShowModalInfo(true);
        setText(result.data.message);
    }

    return (
        <>
            <Container className={`my-5 ${theme.textColor}`}>
                <Row className='mb-2'>
                    <Col>
                        <span>{topics[0]?.sectionName}</span>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                        {userLogged && <Button onClick={handleAddNewTopic} variant={theme.buttonNewOption}>Dodaj nowy temat</Button>}
                    </Col>
                </Row>
                {topics.sort((a: TopicType, b: TopicType) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).map((topic: TopicType) => {
                    return (
                        <Row key={topic.id} className={`border ${theme.border} py-1`}>
                            <Col className='py-1'>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={9}>
                                            <Nav.Link className={`${theme.textColor} px-0`} onClick={() => handleRedirectToTopicWithPosts(topic)}>{topic.topic}</Nav.Link>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <p className='d-flex justify-content-start text-muted my-0'><small>Ostatni post: {topic.updatedAt}</small></p>
                                            <p className='d-flex justify-content-start text-muted my-0'><small>Dodany przez: {topic.lastPostUser}</small></p>
                                            <p className='d-flex justify-content-start text-muted my-0'><small>Ilość postów: {topic.countPostsTopic}</small></p>
                                        </Col>
                                        <Col xs={6} md={10}>
                                            <p className='py-0 text-muted'>
                                                <small>{topic.userId 
                                                ? `Stworzony przez ${topic.userId} ${topic.createdAt}` 
                                                : `Stworzony przez nie istniejące konto ${topic.createdAt}`}
                                                </small>
                                            </p>
                                            
                                        </Col>
                                        <Col xs={6} md={2} className='d-flex justify-content-end align-items-center'>
                                            {userLogged && user.role === 'admin' && <Button variant='outline-danger' size='sm' onClick={() => handleShowModalDeleteTopic(topic.id)}>Usuń</Button>}                                            
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                        )
                    })
                }         
            </Container>
            <ModalTopic show={showModalTopic} onHide={closeModalTopic} sectionName={topics[0]?.sectionName} topicName={topicName} handleNameTopic={handleNewTopicArea} handleAddTopic={handleAddTopicPost} handleFirstPost={handleAddFirstPost} firstPost={firstPost}/>
            <ModalInfo show={showModalInfo} onHide={closeModalInfo} text={text}/>
            <ModalConfirm show={showModalConfirm} onHide={closeModalConfirm} title={title} handleConfirm={handleDeleteTopic}/>
        </>
    )
}

export default Topic;