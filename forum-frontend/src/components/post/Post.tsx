import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';

const Post: React.FC<any> = ({posts, userLogged, handleUpdateRatePost, user, handleEditPost, handleDeletePost}) => {
    return (
        <>
					{posts.map((post: any) => {

					const comparisonTimeCreateAndUpdate: boolean = post.createAt === post.updateAt;
					const checkRated = userLogged && post.userRated.some((userRated: any) => userRated === user.login);

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
																			<HandThumbsUp onClick={() => checkRated ? null : handleUpdateRatePost(1, post.id)} className='mx-2 text-success'/>
																			{post.rating}
																			<HandThumbsDown onClick={() => checkRated ? null : handleUpdateRatePost(-1, post.id)} className='mx-2 text-danger'/>
																	</small>
															</Col>
													</Row>
													<Row>
															<Col>
																	<p>{post.text}</p>
															</Col>
															<Col xs='auto' className='d-flex justify-content-end align-items-center'>
																	{userLogged && (user.role === 'admin' || user.login === post.userId) && <Button className='mx-2' variant='outline-warning' size='sm' onClick={() => handleEditPost(post.id)}>Edytuj</Button>}
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
        </>
    )
}

export default Post;