import React from 'react';
import { Alert } from 'react-bootstrap';

const NotFoundPage: React.FC = (): JSX.Element => {
    return (        
        <Alert variant='danger' className='my-5 d-flex justify-content-center align-items-center'>
            <p className=''>
                Brak szukanej strony
            </p>
        </Alert>
        
    )
}

export default NotFoundPage;