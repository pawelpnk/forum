import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import req from '../../helpers/request';
import { UserContext } from '../../store/StoreProvider';
import ModalInfo from '../modal/ModalInfo';
import ModalConfirm from '../modalConfirm/modalConfirm';
import ModalTopic from '../modalTopic/ModalTopic';

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

    const fetchTopics = async (): Promise<void> => {
        const data = await req.get(`/topic/all/${sectionID}`);
        setTopics(data.data)
        console.log(data.data);
    }

    useEffect(()=> {
        fetchTopics();
    }, [showModalInfo]);

    const handleRedirectToTopicWithPosts = (topic: TopicType) => {
        localStorage.setItem("currentTopic", JSON.stringify(topic));
        navigate(`/sekcja/${topic.id}`);
    }

    const currentSection: string = JSON.parse(localStorage.getItem("currentSection") || "null").sectionName;

    const handleAddNewTopic = () => {
        setShowModalTopic(true);
    }

    const closeModalTopic = () => {
        setShowModalTopic(false);
    }

    const handleNewTopicArea = (event: ChangeEvent<HTMLInputElement>) => {
        setTopicName(event.target.value);
    }

    const handleAddFirstPost = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstPost(e.target.value);
    }

    const validateInputs = () => {
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
            console.log(result.data)
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
            <Container className='my-5 text-light'>
                <Row className='mb-2'>
                    <Col>
                        <span>{currentSection}</span>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                        {userLogged && <Button onClick={handleAddNewTopic} variant='outline-light'>Dodaj nowy temat</Button>}
                    </Col>
                </Row>
                {topics.map((topic: any) => {
                    return (
                        <Row key={topic.id} className='border py-1 '>
                            <Col className='py-1'>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Nav.Link className='text-light px-0' onClick={() => handleRedirectToTopicWithPosts(topic)}>{topic.topic}</Nav.Link>
                                        </Col>
                                        <Col>
                                            <p className='d-flex justify-content-end text-muted '><small>{topic.updatedAt}</small></p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <p className='py-0 text-white-50'>
                                                <small>{topic.userId 
                                                ? `Stworzony przez ${topic.userId} ${topic.createdAt}` 
                                                : `Stworzony przez nie istniejące konto ${topic.createdAt}`}
                                                </small>
                                            </p>
                                        </Col>
                                        <Col className='d-flex justify-content-end align-items-center'>
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
            <ModalTopic show={showModalTopic} onHide={closeModalTopic} sectionName={currentSection} topicName={topicName} handleNameTopic={handleNewTopicArea} handleAddTopic={handleAddTopicPost} handleFirstPost={handleAddFirstPost} firstPost={firstPost}/>
            <ModalInfo show={showModalInfo} onHide={closeModalInfo} text={text}/>
            <ModalConfirm show={showModalConfirm} onHide={closeModalConfirm} title={title} handleConfirm={handleDeleteTopic}/>
        </>
    )
}

export default Topic;