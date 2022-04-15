import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalConfirmType {
    show: boolean,
    onHide: () => void,
    title: string,
    handleConfirm: () => Promise<void>
}

const modalConfirm: React.FC<ModalConfirmType> = ({show, onHide, title, handleConfirm}):JSX.Element => {
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
                    <Modal.Body>{title}</Modal.Body>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={handleConfirm}>Zatwierdź</Button>
                    <Button variant='outline-primary' onClick={onHide}>Anuluj</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default modalConfirm;