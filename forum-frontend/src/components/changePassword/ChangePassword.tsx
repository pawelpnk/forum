import React, { ChangeEvent, useContext, useState } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    const handleCurrentPassword = (event: ChangeEvent<HTMLInputElement>) => setCurrentPassword(event.target.value);
    const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value);
    const handleRepeatPassword = (event: ChangeEvent<HTMLInputElement>) => setRepeatNewPassword(event.target.value);

    const validateInputs = () => {
        let validateValue = true;
        if(!newPassword || !repeatNewPassword || !currentPassword) {
            setMessage("Brak danych");
            validateValue = false;
        } else if(newPassword !== repeatNewPassword) {
            setMessage("Hasła nie są jednakowe");
            validateValue = false;
        } else if(newPassword.length < 8) {
            setMessage("Hasło musi mieć przynajmniej 8 znaków");
            validateValue = false;
        }
        return validateValue;
    }

    const handleChangePassword = async (): Promise<void> => {
        if(validateInputs()) {
            const data = await req.patch('user/user-update', {
                login: user?.login,
                oldPassword: currentPassword,
                newPassword: newPassword
            });

            setCurrentPassword('');
            setNewPassword('');
            setRepeatNewPassword('');
        }       
    } 

    return (
        <Container className={`${theme.textColor}`}>
            <Row>
                <Form className="d-flex flex-column align-items-center" onSubmit={handleChangePassword}>
                    {message.length > 0 ? <p style={{color: 'red'}}>{message}</p> : null }
                    <Form.Group className="d-flex flex-column align-items-center justify-content-center">
                        <Form.Label>Aktualne hasło</Form.Label>
                        <Form.Control type='password' className={`border ${theme.border}`} onChange={handleCurrentPassword} value={currentPassword}/>
                    </Form.Group>                    
                    <Form.Group className="d-flex flex-column align-items-center justify-content-center">
                        <Form.Label>Nowe hasło</Form.Label>
                        <Form.Control type='password' className={`border ${theme.border}`} onChange={handleNewPassword} value={newPassword}/>
                    </Form.Group>                    
                    <Form.Group className="d-flex flex-column align-items-center justify-content-center">
                        <Form.Label>Powtórz nowe hasło</Form.Label>
                        <Form.Control type='password' className={`border ${theme.border}`} onChange={handleRepeatPassword} value={repeatNewPassword}/>
                    </Form.Group>
                    <Button className={`my-2 ${theme.textColor} border ${theme.border}`} variant={theme.buttonToLoginAndRegister} type='submit'>Zmień hasło</Button>                 
                </Form>
            </Row>
        </Container>
    )
}

export default ChangePassword;