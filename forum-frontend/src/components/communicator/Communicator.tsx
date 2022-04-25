import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { CaretDown } from 'react-bootstrap-icons';
import req from '../../helpers/request';

const Communicator: React.FC = (): JSX.Element => {
    const [groups, setGroups] = useState<any>([
        {
            id: 1,
            name: 'cos tam'
        }
    ]);
    const [findUser, setFindUser] = useState<any>('');
    const [newGroup, setNewGroup] = useState<any>('');

    const handleChangeFindUser = (e: ChangeEvent<HTMLInputElement>) => setFindUser(e.target.value);

    const handleFindUserAndCreateNewGroup = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const result = await req.post(`group`, {
            user: findUser
        });

        if(result.data.name) {
            setNewGroup(result.data.name);
        }
    }

    const fetchGroupsUser = async () => {
        const result = await req.get('group');
        setGroups(result.data)
    }

    useEffect(() => {
        fetchGroupsUser();
    },[newGroup])

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <p className='d-flex justify-content-center mt-5 text-secondary'>Uwaga! Wszystkie wiadomości starsze niż 5 dni są usuwane!</p>
                    </Col>
                </Row>
                <Row className='my-5' style={{minHeight: '65vh'}}>
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
                        <div className=''>
                            <p className='text-light mt-3 d-flex justify-content-center'>Czaty</p>
                            {
                            groups.map((group: any) => {
                                return (
                                    <div key={group.id} className='d-flex justify-content-center align-items-center'>
                                        <CaretDown className='text-light mx-2' style={{cursor: 'pointer'}}/>
                                        <span className='text-white' style={{cursor: 'pointer'}}>{group.name}</span>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </Col>
                    <Col xs={9} className='border'>
                        <p className='text-light d-flex justify-content-center mt-2'>Messages</p>

                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Communicator;