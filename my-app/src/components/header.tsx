import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logoutUserAsync } from '../redux/userSlice';
import { ROUTES } from '../modules/Routes';

import { FaUserCircle } from "react-icons/fa"; // Иконка пользователя
import "./header.css";

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Получаем состояние авторизации и имя пользователя из стора
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const username = useSelector((state: RootState) => state.user.login);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Обработчик выхода из системы
    const handleExit = async () => {
        await dispatch(logoutUserAsync(username));
        navigate(ROUTES.ALBUMS);
    };

    return (
        <header>
            <div className="header-container">
                <Link to="/">
                    <img
                        className="emblem"
                        src="http://127.0.0.1:9000/prog/mgtu.png"
                        alt="Эмблема"
                    />
                </Link>
                <div className="title-container">
                    <h1>Редактор занятий</h1>
                </div>
            </div>
            <Dropdown align="end" >
                <Dropdown.Toggle variant="light" className="user-icon">
                    <FaUserCircle size={30} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {isAuthenticated ? (
                        <>
                            <Dropdown.ItemText className="username-text">
                                {username}
                            </Dropdown.ItemText>
                            <Dropdown.Divider />

                            {(isAdmin !== true) ? null : (
                                <>
                                    <Dropdown.Item  as={Link} to={ROUTES.EDIT}>
                                        Редактировать задачи
                                    </Dropdown.Item>
                                </>
                            )}
                            <Dropdown.Item as={Link} to={ROUTES.RESOLUTIONS}>
                                Занятия
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleExit}>
                                Выйти
                            </Dropdown.Item>
                        </>
                    ) : (
                        <Dropdown.Item as={Link} to={ROUTES.LOGIN}>
                            Войти
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </header>
    );
};

export default Header;
