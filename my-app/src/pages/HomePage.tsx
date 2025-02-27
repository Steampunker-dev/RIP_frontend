import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../modules/Routes.tsx";
import { Button, Container } from "react-bootstrap";
import "./HomePage.css"; // Подключаем стили

export const HomePage: FC = () => {
    return (
        <Container className="home-container">
            <p className="home-text">
                Добро пожаловать в <b>составление занятий МГТУ!</b> <br />
                Здесь вы можете выбрать учебные материалы для заданий .
            </p>
            <Link to={ROUTES.ALBUMS}>
                <Button className="home-button">Просмотреть задания</Button>
            </Link>
        </Container>
    );
};
