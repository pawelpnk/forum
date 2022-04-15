import React, { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface ModalSectionType {
    show: boolean,
    onHide: () => void,
    handleNewSection: (e: ChangeEvent<HTMLInputElement>) => void,
    newSectionName: string,
    handleAddSectionPost: () => Promise<void>
}

const ModalSection: React.FC<ModalSectionType> = ({show, onHide, handleNewSection, newSectionName, handleAddSectionPost}): JSX.Element => {
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
                    <Modal.Title>Wprowadź nową sekcje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nazwa nowej sekcji</Form.Label>
                            <Form.Control onChange={handleNewSection} value={newSectionName}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={handleAddSectionPost}>Zatwierdź</Button>
                    <Button variant='outline-primary' onClick={onHide}>Anuluj</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalSection;