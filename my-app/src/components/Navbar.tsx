import "./Navbar.css"
import {FC} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import {ROUTES} from "../modules/Routes.tsx";

export const Navbaar: FC = () => {
    return (
        <>
            <Navbar className="navbar-custom">
                <Container>
                    <Nav>
                        <NavLink to={ROUTES.HOME} className='nav-link'>Главная</NavLink>
                        <NavLink to={ROUTES.ALBUMS} className='nav-link'>Задания</NavLink>
                    </Nav>
                </Container>
            </Navbar>

        </>
    );
};