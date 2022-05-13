import React, { useContext } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import reactStringReplace from 'react-string-replace';
import { ThemeContext } from '../../store/StoreProvider';
import { PostI } from '../topicPosts/TopicPosts';

interface PostType {
	posts: PostI[],
	userLogged: boolean,
	handleUpdateRatePost: (nb: number, id: string) => Promise<void>,
	user: any,
	handleEditPost: (id: string) => void,
	handleDeletePost: (id: string) => Promise<void>
}

const Post: React.FC<PostType> = ({posts, userLogged, handleUpdateRatePost, user, handleEditPost, handleDeletePost}) => {
	const { theme } = useContext(ThemeContext);
    return (
        <>
			{
				posts.map((post: PostI) => {

				const comparisonTimeCreateAndUpdate: boolean = post.createAt === post.updateAt;
				const checkRated: boolean = userLogged && post.userRated.some((userRated: string) => userRated === user.login);

				return (
					<Row key={post.id} className={`border ${theme.border} py-1`}>
						<Col className='py-1'>
							<Container>
								<Row>
									<Col xs={7}>
										<p className='text-muted'><small>Napisano {post.createAt}</small></p>
									</Col>
									<Col xs={5}>
										<small className={`${theme.textColor} py-1 justify-content-end d-flex align-items-center`}>
												<HandThumbsUp onClick={() => checkRated ? null : handleUpdateRatePost(1, post.id)} className='mx-2 text-success' style={{cursor: 'pointer'}}/>
												{post.rating}
												<HandThumbsDown onClick={() => checkRated ? null : handleUpdateRatePost(-1, post.id)} className='mx-2 text-danger' style={{cursor: 'pointer'}}/>
										</small>
									</Col>
								</Row>
								<Row>
									<Col xs={12} sm={9}>
										<p className={theme.textColor}>{reactStringReplace(post.text, /@(\w+)/gi, (match: string, i: number) => (
											<span key={i} style={{color: '#6699ff'}}>@{match}</span>
										))}</p>
									</Col>
									<Col sm={3} className='d-flex justify-content-end align-items-center mb-2'>
										{userLogged && (user.role === 'admin' || user.login === post.userId) && <Button className='mx-2' variant='outline-warning' size='sm' onClick={() => handleEditPost(post.id)}>Edytuj</Button>}
										{userLogged && user.role === 'admin' && <Button variant='outline-danger' size='sm' onClick={() => handleDeletePost(post.id)}>Usuń</Button>}
									</Col>
								</Row>
								<Row>
									<Col>
										<p className={`py-0 my-0 text-muted`}>
											<small>{post.userId 
												? `Stworzony przez ${post.userId} ` 
												: `Stworzony przez nie istniejące konto`}
											</small>
										</p>
									</Col>
									<Col>
										{comparisonTimeCreateAndUpdate ? null : <small className='text-muted  d-flex justify-content-end'>Edytowano: {post.updateAt}</small>}                                        
									</Col>
								</Row>
							</Container>
						</Col>
					</Row>
				)
				})
			}
        </>
    )
}

export default Post;