import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store.tsx';
import { loginUserAsync } from '../redux/userSlice.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../modules/Routes.tsx';
import "./LoginPage.css"; // Подключаем стили

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ login: '', password: '' });
    const error = useSelector((state: RootState) => state.user.error);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.login && formData.password) {
            const resultAction = await dispatch(loginUserAsync(formData));
            if (loginUserAsync.fulfilled.match(resultAction)) {
                navigate(ROUTES.ALBUMS);
            }
        }
    };

    return (
        <Container className="login-container">
            <h2 className="login-title">Авторизация</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="login" style={{ marginBottom: '15px' }}>
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        placeholder="Введите логин"
                        className="form-control"
                    />
                </Form.Group>
                <Form.Group controlId="password" style={{ marginBottom: '20px' }}>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль"
                        className="form-control"
                    />
                </Form.Group>
                <Button type="submit" className="login-button">
                    Войти
                </Button>
            </Form>
        </Container>
    );
};

export default LoginPage;
