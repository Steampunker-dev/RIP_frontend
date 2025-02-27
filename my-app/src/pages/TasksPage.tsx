import "./TasksPage.css";
import { Col, Row, Spinner } from "react-bootstrap";
import InputField from "../components/InputField.tsx";
import { BreadCrumbs } from "../components/BreadCrumbs.tsx";
import { ROUTES, ROUTE_LABELS } from "../modules/Routes.tsx";
import { FineCard } from "../components/FineCard.tsx";
import { useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../redux/store';
import { getFinesList, addFineToResolution } from "../redux/taskSlice.tsx";
import { DsTasks } from "../api/Api.ts";
import {fetchCart} from "../redux/resolutionSlice.tsx";

const TasksPage: FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { searchValue, tasks, loading, resCount, resId } = useSelector((state: RootState) => state.tasks)

    const cart = useSelector(
        (state: RootState) => state.cart.cart,

        (prev, next) => {
            return (prev?.Tasks?.length || 0) === (next?.Tasks?.length || 0);
        }
    );


    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        dispatch(getFinesList()); // отправляем `thunk`
    }, [dispatch]);


    useEffect(() => {
        dispatch(getFinesList()); // ✅ Перезагружаем после изменения `resCount`
    }, [resCount, dispatch]);

    useEffect(() => {
        const resId = localStorage.getItem('resId');
        if (resId && resId !== '0') {
            dispatch(fetchCart()); // ✅ Запрашиваем корзину только если `resId` валиден
        }
    }, [resId, dispatch]);

    useEffect(() => {
        dispatch(getFinesList()); // ✅ Перезагружаем после изменения `resCount`
    }, [cart, dispatch]);

    const handleCardClick = (id: number) => {

        navigate(`${ROUTES.ALBUMS}/${id}`);
    };

    const handleBasketClick = (id: number) => {

        navigate(`${ROUTES.BASKET}/${id}`);
    };


    const handleButtonClick = (id: number) => {

        dispatch(addFineToResolution(id));
    };
    return (
        <div className="container">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ALBUMS }]} />

            <InputField value={searchValue} loading={loading} />

            {loading ? (
                <div className="loadingBg">
                    <Spinner animation="border" />
                </div>
            ) : tasks.length === 0 ? (
                <div>
                    <h1>К сожалению, пока ничего не найдено :(</h1>
                </div>
            ) : (
                <Row
                    xs={1}
                    sm={2}
                    md={3}
                    lg={4}
                    className={`g-4 full-width-row ${
                        tasks.length === 1 ? "justify-content-center" : "justify-content-evenly"
                    }`}
                >
                    {tasks.map((item: DsTasks) => (
                        <Col key={item.id} className="d-flex">
                            <FineCard
                                image={item.image ?? ""}
                                title={item.title ?? ""}
                                description={item.description ?? ""}
                                minutes={item.minutes ?? 0}
                                imageClickHandler={() => handleCardClick(item.id)}
                                buttonClickHandler={() => handleButtonClick(item.id)}
                            />
                        </Col>
                    ))}
                </Row>
            )}
            <a id={`resID-`} className="cart-icon" onClick={() => handleBasketClick(resId)}>
                gffg
                {(!isAuthenticated || !resId || resCount === 0) ? null : (
                    <div>
                        <img src="https://www.svgrepo.com/show/133694/act.svg" alt="Корзина"/>
                        <span className="badge">{resCount}</span>
                    </div>
            )}

            </a>
        </div>
    );
};

export default TasksPage;
