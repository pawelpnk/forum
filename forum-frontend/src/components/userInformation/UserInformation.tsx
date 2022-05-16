import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { UserContext } from '../../store/StoreProvider';

const UserInformation: React.FC = (): JSX.Element => {
    const { user } = useContext(UserContext);
    return (
        <div className="d-flex justify-content-center">
            <Card style={{ width: '18rem' }} >
                <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title>{user?.login}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{user?.role}</Card.Subtitle>
                    <Card.Text className="mb-2 text-muted">Utworzone: {user?.createdAt}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default UserInformation;