import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Toast } from 'react-bootstrap';
import { CaretDown, Cursor } from 'react-bootstrap-icons';
import req from '../../helpers/request';
import { SocketContext, UserContext } from '../../store/StoreProvider';

const Communicator: React.FC = (): JSX.Element => {
    const [groups, setGroups] = useState<any>([]);
    const [findUser, setFindUser] = useState<any>('');
    const [newGroup, setNewGroup] = useState<any>('');
    const [textMessage, setTextMessage] = useState<any>('');
    const [messages, setMessages] = useState<any>([]);
    const [currentGroup, setCurrentGroup] = useState<any>([]);

    const { user } = useContext(UserContext);
    const socket = useContext(SocketContext);

    const handleChangeFindUser = (e: ChangeEvent<HTMLInputElement>) => setFindUser(e.target.value);
    const handleChangeTextMessage = (e: ChangeEvent<HTMLInputElement>) => setTextMessage(e.target.value);

    const handleFindUserAndCreateNewGroup = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const result = await req.post(`group`, {
            user: findUser
        });

        if(result.data.name) {
            setNewGroup(result.data.name);
            setFindUser('');
        }
    }

    const handleReceiveMessages = async (id: string) => {
        socket.emit('all-message-from-database', id);
        socket.on('send-messages-group', (data:any)  => {
            setMessages(data);
        })
        return () => socket.off('send-messages-group');
    }

    const handleSendNewMessage = (e: FormEvent) => {
        e.preventDefault();
        socket.emit('message-from-client', {
            text: textMessage,
            group: currentGroup,
            userLogin: user.login
        });
        
        setTextMessage('')
    }

    const fetchGroupsUser = async () => {
        const result = await req.get('group');
        setGroups(result.data);
        console.log(result.data)
    }

    useEffect(() => {
        fetchGroupsUser();
    },[newGroup])

    useEffect(() => {
        handleReceiveMessages(currentGroup.id);   
        socket.on('new-message', (data: any) => {
            setMessages((prev: any) => [...prev, data]);
       })     
    },[])

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className='d-flex justify-content-center mt-5 text-secondary'>Uwaga! Wszystkie wiadomości starsze niż 5 dni są usuwane!</p>
                    </Col>
                </Row>
                <Row className='my-3' style={{minHeight: '70vh'}}>
                    <Col xs={3} className='border overflow-auto' >
                        <Form onSubmit={handleFindUserAndCreateNewGroup} className='d-flex flex-column align-items-center'>
                            <Form.Control
                                type='text'
                                placeholder='użytkownik'
                                className='mt-1'
                                value={findUser} 
                                onChange={handleChangeFindUser}
                            />
                            <Button variant='outline-secondary' type='submit' className='my-2'>Znajdź</Button>
                        </Form>
                        <div>
                            <p className='text-light mt-3 d-flex justify-content-center'>Konwersacje</p>
                            {
                            groups.map((group: any) => {
                                return (
                                    <div onClick={() =>{ handleReceiveMessages(group.id); setCurrentGroup(group)}} key={group.id} className='d-flex justify-content-center align-items-center' style={{cursor: 'pointer'}}>
                                        <CaretDown className='text-light mx-2' />
                                        <span className='text-white'>{group.name}</span>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </Col>
                    <Col xs={9} className='border d-flex flex-column'>
                        <p className='text-light d-flex justify-content-center mt-2 border-bottom'>Wiadomości</p>
                        <div className='overflow-auto d-flex flex-column'>
                            {
                                messages.map((message: any, index: number) => {                                    
                                    return (
                                        <Toast key={index} className={message.author === user?.login ? 'align-self-end bg-success mb-1' : 'mb-1'}>
                                            <Toast.Body >
                                                {message.text}
                                            </Toast.Body>
                                        </Toast>
                                    )
                                })
                            }
                        </div>
                        <Form onSubmit={handleSendNewMessage} className='d-flex justify-self-end mb-1' style={{marginTop: 'auto'}}>
                            <Form.Control
                            type='text'
                            placeholder='wiadomość'
                            value={textMessage}
                            onChange={handleChangeTextMessage}
                            />
                            <Button type='submit'><Cursor style={{cursor: 'pointer'}} /></Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Communicator;