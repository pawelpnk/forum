import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import req from '../../helpers/request';

const TopicPosts: React.FC = (): JSX.Element => {
    const [posts, setPosts] = useState<any>([]);

    const { topicID } = useParams();

    const fetchPosts = async (): Promise<void> => {
        const data = await req.get(`post/all/${topicID}`)
        setPosts(data.data);
        console.log(data.data)
    }

    useEffect(()=>{
        fetchPosts();
        console.log(posts)
    },[])

    const currentTopic = JSON.parse(localStorage.getItem("currentTopic") || "null").topic;
    const currentTopicAuthor = JSON.parse(localStorage.getItem("currentTopic") || "null").userId;
    const currentSection = JSON.parse(localStorage.getItem("currentSection") || "null").sectionName;
    const currentSectionID = JSON.parse(localStorage.getItem("currentSection") || "null").id;

    

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
                                </Row>
                                <Row>
                                    <Col>
                                        <p className='py-0 my-0 text-white-50'>
                                            <small>{post.userId 
                                            ? `Stworzony przez ${post.userId} $postc.createdAt}` 
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
        </Container>
    )
}

export default TopicPosts;