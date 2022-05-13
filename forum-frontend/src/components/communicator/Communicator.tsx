import React, { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row, Toast } from 'react-bootstrap';
import { CaretDown, Cursor } from 'react-bootstrap-icons';
import req from '../../helpers/request';
import { SocketContext, ThemeContext, UserContext } from '../../store/StoreProvider';
import './communicator.css';

interface GroupI {
    id: string;
    name: string;
    updateAt: string;
    user?: object;
}

interface MessageI {
    id: string;
    text: string;
    author: string;
    createAt: string;
    group?: GroupI;
}

const Communicator: React.FC = (): JSX.Element => {
    const [groups, setGroups] = useState<GroupI[]>([]);
    const [findUser, setFindUser] = useState<string>('');
    const [newGroup, setNewGroup] = useState<string>('');
    const [textMessage, setTextMessage] = useState<string>('');
    const [messages, setMessages] = useState<MessageI[]>([]);
    const [currentGroup, setCurrentGroup] = useState<any>('');

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

    const handleReceiveMessages = useCallback((id: string) => {
        socket.emit('all-message-from-database', id);
        socket.on('send-messages-group', (data: MessageI[])  => {
            setMessages(data);
        })
        return () => socket.off('send-messages-group');
    },[])

    const handleSendNewMessage = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        socket.emit('message-from-client', {
            text: textMessage,
            group: currentGroup,
            userLogin: user.login
        });
        await req.patch(`group`,{
            id: currentGroup.id
        });
        setTextMessage('')
    }

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    useEffect(() => {        
        const fetchGroupsUser = async () => {
            const result = await req.get('group');
            setGroups(result.data);
            setCurrentGroup(() => result.data[0]);
            handleReceiveMessages(result.data[0].id);        
        }
        fetchGroupsUser();
    },[newGroup])

    useEffect(() => {
        socket.on('new-message', (data: MessageI[]) => {
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
                        <p className='d-flex justify-content-center mt-5 text-secondary'>Uwaga! Wszystkie wiadomości są usuwane o północy!</p>
                    </Col>
                </Row>
                <Row className='my-3 communicator-list' style={{height: '70vh'}}>
                    <Col xs={12} className={`col-xs-12 col-sm-3 border ${theme.border} overflow-auto`} >
                        <Form onSubmit={handleFindUserAndCreateNewGroup} className='d-flex flex-column align-items-center'>
                            <Form.Control
                                type='text'
                                placeholder='user'
                                className={`mt-2 ${theme.border}`}
                                value={findUser} 
                                onChange={handleChangeFindUser}
                            />
                            <Button variant='outline-secondary' type='submit' className='my-2'>Znajdź</Button>
                        </Form>
                        <div>
                            <p className={`${theme.textColor} mt-3 d-flex justify-content-center`}>Konwersacje</p>
                            {
                            groups.sort((a: GroupI, b: GroupI) => +new Date(b.updateAt) - +new Date(a.updateAt)).map((group: GroupI) => {                                
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
                    <Col xs={12} className={`col-xs-12 col-sm-9 border ${theme.border} d-flex flex-column`}>
                        <p className={`${theme.textColor} d-flex justify-content-center mt-2 border-bottom ${theme.border}`}>Wiadomości</p>                        
                        <div className='overflow-auto d-flex flex-column' >
                            {
                                messages.map((message: MessageI, index: number) => {
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