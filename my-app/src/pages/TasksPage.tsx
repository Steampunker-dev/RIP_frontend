import "./TasksPage.css";
import { Col, Row, Spinner } from "react-bootstrap";
import InputField from "../components/InputField.tsx";
import { BreadCrumbs } from "../components/BreadCrumbs.tsx";
import { ROUTES, ROUTE_LABELS } from "../modules/Routes.tsx";
import { FineCard } from "../components/FineCard.tsx";
import { useNavigate } from "react-router-dom";
import { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addFineToResolution } from "../redux/taskSlice.tsx";
import { useTasks } from "../context/TasksContext";

const TasksPage: FC = () => {
    const { state, applyFilter } = useTasks();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { tasks, loading, filter } = state;
    const resCount = useSelector((state: RootState) => state.tasks.resCount);
    const resId = useSelector((state: RootState) => state.tasks.resId);
    console.log(resId)
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    const [searchValue, setSearchValue] = useState(filter);

    useEffect(() => {
        console.log("📢 Текущий список задач:", tasks);
    }, [tasks]);

    const handleFilterChange = (value: string) => {
        console.log("🎯 Фильтр изменен:", value);
        setSearchValue(value);
        applyFilter(value);
    };

    const handleCardClick = (id: number) => {
        navigate(`${ROUTES.ALBUMS}/${id}`); // ✅ Работает переход по карточке
    };

    const handleBasketClick = (id: number) => {
        navigate(`${ROUTES.BASKET}/${id}`); // ✅ Работает переход в корзину
    };

    const handleButtonClick = (id: number) => {
        dispatch(addFineToResolution(id)); // ✅ Добавляем в корзину через Redux
    };
    return (
        <div className="container">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ALBUMS }]} />

            <InputField value={searchValue} loading={loading} onChange={handleFilterChange} />

            {loading ? (
                <div className="loadingBg">
                    <Spinner animation="border" />
                </div>
            ) : tasks.length === 0 ? (
                <div>
                    <h1>К сожалению, пока ничего не найдено :(</h1>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 full-width-row">
                    {tasks.map((item) => (
                        <Col key={item.id} className="d-flex">
                            <FineCard
                                image={item.image ?? ""}
                                description={item.description ?? ""}
                                title={item.title ?? ""}
                                minutes={item.minutes ?? 0}
                                imageClickHandler={() => handleCardClick(item.id)}
                                buttonClickHandler={() => handleButtonClick(item.id)}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* ✅ Вернули иконку корзины */}
            <a id={`resID-`} className="cart-icon" onClick={() => handleBasketClick(resId)}>
                    <div>
                        <img src="https://www.svgrepo.com/show/133694/act.svg" alt="Корзина"/>
                        <span className="badge">{resCount}</span>
                    </div>
            </a>
        </div>
    );
};

export default TasksPage;