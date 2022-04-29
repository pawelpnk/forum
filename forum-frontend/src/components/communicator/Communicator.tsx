import React, { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row, Toast } from 'react-bootstrap';
import { CaretDown, Cursor } from 'react-bootstrap-icons';
import req from '../../helpers/request';
import { SocketContext, ThemeContext, UserContext } from '../../store/StoreProvider';

const Communicator: React.FC = (): JSX.Element => {
    const [groups, setGroups] = useState<any>([]);
    const [findUser, setFindUser] = useState<any>('');
    const [newGroup, setNewGroup] = useState<any>('');
    const [textMessage, setTextMessage] = useState<any>('');
    const [messages, setMessages] = useState<any>([]);
    const [currentGroup, setCurrentGroup] = useState<any>([]);

    const { user } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const { theme } = useContext(ThemeContext);

    const lastMessageRef = useRef<null | HTMLDivElement>(null);

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
        req.patch(`group`,{
            id: currentGroup.id
        });
        setTextMessage('')
    }

    const fetchGroupsUser = async () => {
        const result = await req.get('group');
        setGroups(result.data);
        setCurrentGroup(() => result.data[0]);
        handleReceiveMessages(result.data[0].id);        
    }

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    useEffect(() => {
        fetchGroupsUser();
    },[newGroup])

    useEffect(() => {
        socket.on('new-message', (data: any) => {
            setMessages((prev: any) => [...prev, data]);
        });
        return () => socket.off('new-message')
    },[])

    useEffect(() => {
        scrollToBottom();
    },[messages])

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className='d-flex justify-content-center mt-5 text-secondary'>Uwaga! Wszystkie wiadomości starsze niż 5 dni są usuwane!</p>
                    </Col>
                </Row>
                <Row className='my-3' style={{height: '70vh'}}>
                    <Col xs={3} className={`border ${theme.border} overflow-auto`} style={{height: '70vh'}}>
                        <Form onSubmit={handleFindUserAndCreateNewGroup} className='d-flex flex-column align-items-center'>
                            <Form.Control
                                type='text'
                                placeholder='użytkownik'
                                className={`mt-2 ${theme.border}`}
                                value={findUser} 
                                onChange={handleChangeFindUser}
                            />
                            <Button variant='outline-secondary' type='submit' className='my-2'>Znajdź</Button>
                        </Form>
                        <div>
                            <p className={`${theme.textColor} mt-3 d-flex justify-content-center`}>Konwersacje</p>
                            {
                            groups.map((group: any) => {                                
                                return (
                                    <div onClick={() =>{handleReceiveMessages(group.id); setCurrentGroup(group)}} key={group.id} className='d-flex justify-content-center align-items-center' style={{cursor: 'pointer'}}>
                                        <CaretDown className={`${theme.textColor} mx-2`} />
                                        <span className={currentGroup?.id === group.id ? 'text-warning' : theme.textColor}>{group.name}</span>
                                    </div>
                                )
                            })                            
                            }
                        </div>
                    </Col>
                    <Col xs={9} className={`border ${theme.border} d-flex flex-column`} style={{height: '70vh'}}>
                        <p className={`${theme.textColor} d-flex justify-content-center mt-2 border-bottom ${theme.border}`}>Wiadomości</p>                        
                        <div className='overflow-auto d-flex flex-column' >
                            {
                                messages.map((message: any, index: number) => {
                                    return (
                                        <Toast key={index} className={message.author === user?.login ? `align-self-end ${theme.colorMyMessage} mb-1` : 'mb-1'}>
                                            <Toast.Body>
                                                {message.text}
                                            </Toast.Body>
                                        </Toast>
                                    )
                                })
                            }
                            <div ref={lastMessageRef} />
                        </div>
                        <Form onSubmit={handleSendNewMessage} className='d-flex justify-self-end mb-1' style={{marginTop: 'auto'}}>
                            <Form.Control
                            type='text'
                            placeholder='wiadomość'
                            value={textMessage}
                            onChange={handleChangeTextMessage}
                            className={theme.border}
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