import React, { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface ModalPostEditType {
    show: boolean,
    onHide: () => void,
    textPost: string,
    handleInputEditPost: (e: ChangeEvent<HTMLInputElement>) => void,
    handleUpdatePost: () => Promise<void>
}

const ModalPostEdit: React.FC<ModalPostEditType> = ({show, onHide, textPost, handleInputEditPost, handleUpdatePost}): JSX.Element => {
    return (
        <>
            <Modal show={show} onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop='static'
            keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Edytowanie postu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Wpisz nowy tekst</Form.Label>
                            <Form.Control onChange={handleInputEditPost} value={textPost}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={handleUpdatePost}>Zatwierdź</Button>
                    <Button variant='outline-primary' onClick={onHide}>Anuluj</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalPostEdit;