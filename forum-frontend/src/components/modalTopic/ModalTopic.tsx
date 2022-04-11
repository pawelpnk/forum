import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const ModalTopic: React.FC<any> = ({show, onHide, sectionName, topicName, handleNameTopic, handleAddTopic, handleFirstPost, firstPost}): JSX.Element => {
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
                    <Modal.Title>Wprowadź nowy temat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Sekcja</Form.Label>
                            <Form.Control placeholder={sectionName} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nazwa tematu</Form.Label>
                            <Form.Control onChange={handleNameTopic} value={topicName}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Opisz problem</Form.Label>
                            <Form.Control onChange={handleFirstPost} value={firstPost}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={handleAddTopic}>Zatwierdź</Button>
                    <Button variant='outline-primary' onClick={onHide}>Anuluj</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalTopic;