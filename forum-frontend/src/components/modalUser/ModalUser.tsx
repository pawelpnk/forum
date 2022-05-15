import React, { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface IProps {
    show: boolean,
    onHide: () => void,
    handleOnCheckDeleteAvatar: (event: ChangeEvent<HTMLInputElement>) => void,
    handleChangeRole: (event: ChangeEvent<HTMLSelectElement>) => void,
    handleSetBan: (event: ChangeEvent<HTMLInputElement>) => void,
    currentRole: string,
    timeBan: string,
    userName: string | undefined,
    handleSubmitChanges: () => Promise<void>,
    handleDeleteAccount: () => Promise<void>,
    handleSetReasonBan: (event: ChangeEvent<HTMLInputElement>) => void,
    reasonBan: string
}

const ModalUser: React.FC<IProps> = ({show, onHide, handleOnCheckDeleteAvatar, handleChangeRole, handleSetBan, currentRole, timeBan, userName, handleSubmitChanges, handleDeleteAccount, handleSetReasonBan, reasonBan}): JSX.Element=> {
    return (
        <Modal show={show} onHide={onHide}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop='static'
                keyboard={false}
                >
                <Modal.Header>
                    <Modal.Title>Użytkownik {userName}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center">
                    <Form>
                        <Form.Group >
                            <Form.Check type="checkbox" label="Usuń avatar" onChange={handleOnCheckDeleteAvatar} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Zmień role</Form.Label>
                            <Form.Select size="sm" onChange={handleChangeRole} value={currentRole}>
                                <option>Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ban - wpisz do kiedy</Form.Label>
                            <Form.Control type="text" placeholder="rrrr-mm-dd gg:00" onChange={handleSetBan} value={timeBan}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Powód</Form.Label>
                            <Form.Control type="text" placeholder="tekst" onChange={handleSetReasonBan} value={reasonBan}/>
                        </Form.Group>
                    </Form>
                    <Button className='my-2' variant="danger" onClick={handleDeleteAccount}>Usuń konto</Button>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant='outline-primary' onClick={handleSubmitChanges}>Zatwierdź</Button>
                    <Button variant='outline-primary' onClick={onHide}>Anuluj</Button>
                </Modal.Footer>
            </Modal>
    )
}

export default ModalUser;