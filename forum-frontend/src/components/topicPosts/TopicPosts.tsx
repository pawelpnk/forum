import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Nav, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import req from '../../helpers/request';
import { UserContext } from '../../store/StoreProvider';

const TopicPosts: React.FC = (): JSX.Element => {
    const [posts, setPosts] = useState<any>([]);
    const [newPost, setNewPost] = useState<string>('');
    const [refreshPage, setRefreshPage] = useState<boolean>(false);

    const { topicID } = useParams();
    const { user } = useContext(UserContext);
    const userLogged: boolean = Boolean(user);

    const fetchPosts = async (): Promise<void> => {
        const data = await req.get(`post/all/${topicID}`)
        setPosts(data.data);
        console.log(data.data)
    }

    useEffect(()=>{
        fetchPosts();
    },[refreshPage]);

    const currentTopic = JSON.parse(localStorage.getItem("currentTopic") || "null").topic;
    const currentTopicAuthor = JSON.parse(localStorage.getItem("currentTopic") || "null").userId;
    const currentSection = JSON.parse(localStorage.getItem("currentSection") || "null").sectionName;
    const currentSectionID = JSON.parse(localStorage.getItem("currentSection") || "null").id;

    const handleNewPost = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPost(e.target.value)
    }

    const validateText = () => {
        if(newPost.length < 10) {
            return false
        }
        return true;
    }

    const handleSubmitNewPost = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if(validateText()){            
            setNewPost('');
            const result = await req.post('post/new', {
                text: newPost,
                idUser: user.id,
                idTopic: topicID
            })
            setRefreshPage(prev => !prev);
        }        
    }

    const handleDeletePost = async (id: string): Promise<void> => {
        await req.delete(`post/delete/${id}`);
        setRefreshPage(prev => !prev)
    }

    return (
        <Container className='text-light'>
            <Nav.Link className='my-5 px-0 text-info' href={`/s/${currentSectionID}`}>Wróć do tematów z sekcji: {currentSection}</Nav.Link>
            <p className='my-5'>{currentTopic}</p>
            <p>Stworzony przez: {currentTopicAuthor}</p>
            {posts.map((post: any) => {

                const comparisonTimeCreateAndUpdate: boolean = post.createAt === post.updateAt;

                return (
                    <Row key={post.id} className='border py-1'>
                        <Col className='py-1'>
                            <Container>
                                <Row>
                                    <Col>
                                        <p className='text-muted'><small>Napisano {post.createAt}</small></p>
                                    </Col>
                                    <Col>
                                        <small className='text-light py-1 justify-content-end d-flex align-items-center'>
                                            <HandThumbsUp className='mx-2 text-success'/>
                                            {post.rating}
                                            <HandThumbsDown className='mx-2 text-danger'/>
                                        </small>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>{post.text}</p>
                                    </Col>
                                    <Col className='d-flex justify-content-end align-items-center'>
                                        {userLogged && (user.role === 'admin' || user.login === post.userId) && <Button className='mx-2' variant='outline-warning' size='sm'>Edytuj</Button>}
                                        {userLogged && user.role === 'admin' && <Button variant='outline-danger' size='sm' onClick={() => handleDeletePost(post.id)}>Usuń</Button>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className='py-0 my-0 text-white-50'>
                                            <small>{post.userId 
                                            ? `Stworzony przez ${post.userId} ` 
                                            : `Stworzony przez nie istniejące konto`}
                                            </small>
                                        </p>
                                    </Col>
                                    <Col>
                                        {comparisonTimeCreateAndUpdate ? null : <small className='text-white-50  d-flex justify-content-end'>Edytowano: {post.updateAt}</small>}                                        
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    )
                })
            }
            <Form className='my-4' onSubmit={handleSubmitNewPost}>
                <Form.Group className='my-4'>
                    <Form.Label>Dodaj nowy post</Form.Label>
                    <Form.Control as='textarea' rows={4} value={newPost} onChange={handleNewPost} placeholder="Minimum 10 znaków"/>
                </Form.Group>
                <Button variant='outline-secondary' type='submit'>Dodaj</Button>
            </Form> 
        </Container>
    )
}

export default TopicPosts;