import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { ThemeContext } from '../../store/StoreProvider';
import ModalInfo from '../modal/ModalInfo';

const Register: React.FC = (): JSX.Element => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [acceptCondition, setAcceptCondition] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const [showModal, setShowModal] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    const { theme } = useContext(ThemeContext);

    const navigate = useNavigate();

    useEffect(()=> {
        resetInputs();
    },[]);

    const handleOnLogin = (event: ChangeEvent<HTMLInputElement>): void => setLogin(event.target.value);
    const handleOnPassword = (event: ChangeEvent<HTMLInputElement>): void => setPassword(event.target.value);
    const handleOnRepeatPassword = (event: ChangeEvent<HTMLInputElement>): void => setRepeatPassword(event.target.value);
    const handleOnEmail = (event: ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value);
    const handleOnCheck = (event: ChangeEvent<HTMLInputElement>): void => setAcceptCondition(event.target.checked);

    const validateInputs = () => {
        let validateValue = true;
        if(!login || login.length < 6) {
            setMessage("Login musi mieć minimum 6 znaków");
            validateValue = false;
        } else if(!password || password.length < 8) {
            setMessage("Hasło musi mieć przynajmniej 8 znaków");
            validateValue = false;
        } else if(password !== repeatPassword) {
            setMessage('Hasła nie są jednakowe');
            validateValue = false;
        } else if(!acceptCondition) {
            setMessage("Zaakceptuj regulamin");
            validateValue = false;
        }
        return validateValue;
    }

    const resetInputs = () => {
        setLogin('');
        setPassword('');
        setEmail('');
        setRepeatPassword('');
        setMessage('');
        setAcceptCondition(false);
    }

    const handleOnSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        if(validateInputs()){
            try {
                const result = await req.post(`user/register`, {
                    login,
                    password,
                    email
                });
                setShowModal(true);
                setText(result.data.message);
                resetInputs();
                navigate('/');
            } catch {}            
        }
    }

    const checkValidationMessage: JSX.Element | null = message.length > 0 ? <p className='text-danger'>{message}</p> : null;

    const handleOnClose = () => {
        setShowModal(false);
        setText('');
    }

    return (
        <div className='d-flex justify-content-center'>
            <Form className='my-5 p-4' onSubmit={handleOnSubmit}>
                {checkValidationMessage}
                <Form.Group className={`my-2 col-md-12 border ${theme.border}`}>
                    <Form.Control placeholder='login' type='text' onChange={handleOnLogin} value={login}/>
                </Form.Group>
                <Form.Group className={`my-2 col-md-12 border ${theme.border}`}>
                    <Form.Control placeholder='hasło' type='password' onChange={handleOnPassword} value={password}/>
                </Form.Group>
                <Form.Group className={`my-2 col-md-12 border ${theme.border}`}>
                    <Form.Control placeholder='potwierdź hasło' type='password' onChange={handleOnRepeatPassword} value={repeatPassword}/>
                </Form.Group>
                <Form.Group className={`my-2 col-md-12 border ${theme.border}`}>
                    <Form.Control placeholder='email' type='email' onChange={handleOnEmail} value={email}/>
                </Form.Group>
                <Form.Group className={`my-2 ${theme.textColor}`} >
                    <Form.Check type="checkbox" label="Akceptuj regulamin" onChange={handleOnCheck} />
                </Form.Group>
                <Button className={`my-2 ${theme.textColor} border ${theme.border}`} variant={theme.buttonToLoginAndRegister} type="submit">
                    Zarejstruj
                </Button>
            </Form>
            <ModalInfo show={showModal} onHide={handleOnClose} text={text}/>
        </div>
    )
}

export default Register;