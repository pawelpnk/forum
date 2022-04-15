import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalInfoType {
    show: boolean,
    onHide: () => void,
    text: string
}

const ModalInfo: React.FC<ModalInfoType> = ({show, onHide, text}): JSX.Element => {
    return (
        <>
            <Modal show={show} onHide={onHide}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop='static'
                >
                <Modal.Body>
                    <p>
                    {text}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={onHide}>Potwierdź</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalInfo;