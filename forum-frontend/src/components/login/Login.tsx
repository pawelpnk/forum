import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext, UserContext } from '../../store/StoreProvider';

const Login: React.FC = (): JSX.Element => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [message, setMessage] = useState<string>('');

    const { setUser } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const navigate = useNavigate();

    const handleOnLogin = (event: ChangeEvent<HTMLInputElement>): void => setLogin(event.target.value);
    const handleOnPassword = (event: ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value);

    const resetInputs = () => {
        setLogin('');
        setPassword('');
        setMessage('');
    }

    useEffect(() => {
        resetInputs();
    }, []);

    const handleOnSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            const result = await req.post('user/login', {
                login,
                password
            });
            setMessage(result.data.message);
            if(result.data.message === 'Zalogowano pomyślnie') {
                resetInputs();
                setUser(result.data.user);
                sessionStorage.setItem('currentUser', JSON.stringify(result.data.user));
                navigate('/');
            }
        } catch {}
    }

    return (
        <div className='d-flex justify-content-center'>
            <Form className='my-5 p-4' onSubmit={handleOnSubmit}>
                <p className='text-danger'>{message}</p>
                <Form.Group className='my-2 col-md-12'>
                    <Form.Control placeholder='login' type='text' className={theme.border} onChange={handleOnLogin} value={login}/>
                </Form.Group>
                <Form.Group className='my-2 col-md-12'>
                    <Form.Control placeholder='hasło' type='password' className={theme.border} onChange={handleOnPassword} value={password}/>
                </Form.Group>
                <Button className={`my-2 ${theme.textColor} border ${theme.border}`} variant={theme.buttonToLoginAndRegister} type="submit">
                    Zaloguj
                </Button>
            </Form>
        </div>
    )
}

export default Login;
