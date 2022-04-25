import React from 'react';
import { Alert } from 'react-bootstrap';

const CommunicatorAlert: React.FC = (): JSX.Element => {
    return (
        <>
            <Alert variant='primary' className='my-5 d-flex justify-content-center align-items-center'>
                <p className=''>
                    Musisz się zalogować, żeby korzystać z komunikatora
                </p>
            </Alert>
        </>
    )
}

export default CommunicatorAlert;