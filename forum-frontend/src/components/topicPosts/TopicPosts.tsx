import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Nav } from 'react-bootstrap';
import { useParams } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';
import ModalPostEdit from '../modalPostEdit/ModalPostEdit';
import PaginationPost from '../pagination/PaginationPost';
import Post from '../post/Post';

const TopicPosts: React.FC = (): JSX.Element => {
	const [posts, setPosts] = useState<any>([]);
	const [postsInOnePage, setPostsInOnePage] = useState<any>([]);
	const [newPost, setNewPost] = useState<string>('');
	const [refreshPage, setRefreshPage] = useState<boolean>(false);
	const [showModalEditPost, setShowModalEditPost] = useState<boolean>(false);
	const [newTextPost, setNewTextPost] = useState<string>('');
	const [postId, setPostId] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPage, setTotalPage] = useState<number>(1);
	const [currentTopicLS, setCurrentTopicLS] = useState<string | undefined>('');

	const postPerPage = 10;

	const { topicID } = useParams();
	const { user } = useContext(UserContext);
	const { theme } = useContext(ThemeContext);
	const userLogged: boolean = Boolean(user);

	const fetchPosts = async (): Promise<void> => {
		const data = await req.get(`post/all/${topicID}`)
		setPosts(data.data.sort((a: any, b: any) => +new Date(a.createAt) - +new Date(b.createAt)));
		setTotalPage(Math.ceil(data.data.length/postPerPage));
	}

	useEffect(()=>{
		fetchPosts();
		setCurrentTopicLS(topicID);
	},[refreshPage, currentTopicLS, topicID]);

	const setPostInPage = () => {
		const lastIndexPost = currentPage * postPerPage;
		const firstIndexPost = lastIndexPost - postPerPage;;
		const currentPosts = posts.slice(firstIndexPost, lastIndexPost);
		setPostsInOnePage(currentPosts);
	}	

	useEffect(()=>{
		setPostInPage();
	},[currentPage, posts])

	const handleNewPost = (e: ChangeEvent<HTMLInputElement>) =>	setNewPost(e.target.value)

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
			await req.post('post/new', {
					text: newPost,
					idUser: user.id,
					topicId: topicID,
					sectionName: posts[0]?.sectionName
			})
			setRefreshPage(prev => !prev);
		}        
	}

	const handleDeletePost = async (id: string): Promise<void> => {
		await req.delete(`post/delete/${id}`);
		setRefreshPage(prev => !prev)
	}

	const handleEditPost = (id: string) => {
		setPostId(id);
		setShowModalEditPost(true);
	}

	const closeModalEditPost = () => setShowModalEditPost(false);

	const handleInputEditPost = (e: ChangeEvent<HTMLInputElement>) => setNewTextPost(e.target.value);

	const handleUpdatePost = async (): Promise<void> => {
		await req.patch(`post/update/${postId}`, {
				text: newTextPost
		});
		setRefreshPage(prev => !prev);
		setShowModalEditPost(false); 
	}

	const handleUpdateRatePost = async(nb: number, id: string): Promise<void> => {
		if(userLogged) {
			await req.patch(`post/update/rate/${id}`, {
					rate: nb,
					userLogin: user.login
			})
			setRefreshPage(prev => !prev);
		}
	}

	const pagi = (number: number) => setCurrentPage(number);

	return (
		<Container className={`${theme.textColor} mb-3`}>
				<Nav.Link className='my-5 px-0 text-info'>Jesteś w postach związanych z sekcją: {posts[0]?.sectionName}</Nav.Link>
				<p className='my-5'>{posts[0]?.sectionName}</p>
				<p>Stworzony przez: {posts[0]?.userId}</p>
				<Post posts={postsInOnePage} userLogged={userLogged} handleUpdateRatePost={handleUpdateRatePost} user={user} handleEditPost={handleEditPost} handleDeletePost={handleDeletePost} />
				<PaginationPost totalPage={totalPage} currentPage={currentPage} pagi={pagi} />
				{
					userLogged &&
					<Form className='my-4' onSubmit={handleSubmitNewPost}>
						<Form.Group className='my-4'>
							<Form.Label>Dodaj nowy post</Form.Label>
							<Form.Control className={`border ${theme.border}`} as='textarea' rows={4} value={newPost} onChange={handleNewPost} placeholder="Minimum 10 znaków"/>
						</Form.Group>
						<Button variant='outline-secondary' type='submit'>Dodaj</Button>
					</Form>
				}
				<ModalPostEdit show={showModalEditPost} onHide={closeModalEditPost} textPost={newTextPost} handleInputEditPost={handleInputEditPost} handleUpdatePost={handleUpdatePost}/>
		</Container>
	)
}

export default TopicPosts;