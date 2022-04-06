import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
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

    return (
        <Container className='text-light'>
            <p className='my-5'>{JSON.parse(localStorage.getItem("currentTopic") || "null").topic}</p>
            <p>Stworzony przez: {JSON.parse(localStorage.getItem("currentTopic") || "null").userId}</p>
            {posts.map((post: any) => {
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