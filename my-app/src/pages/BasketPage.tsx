import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchCart, deleteFinFromRes, deleteResolution, updateResolutionStatus } from "../redux/resolutionSlice";
import { BasketCard } from "../components/BasketCard.tsx";
import { Button, Spinner } from "react-bootstrap";
import "./BasketPage.css";
import { ROUTES } from "../modules/Routes.tsx";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { cart, error, isLoading } = useSelector((state: RootState) => state.cart);
    const navigate = useNavigate();
    console.log()
    // Локальное состояние для отображения успешного сообщения
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (cart && cart.fines.length === 0) {
            navigate(ROUTES.ALBUMS); // Редирект на главную, если корзина пуста
        }
    }, [cart, navigate]);

    if (error) return <div>Ошибка: {error}</div>;

    // Функция удаления штрафа
    const handleDeleteFine = (finReseId: string) => {

        console.log("Удаление задачи с ID:", finReseId);
        dispatch(deleteFinFromRes(finReseId));
    };

    // Функция удаления всей резолюции (корзины)
    const handleDeleteResolution = async () => {
        await dispatch(deleteResolution());
        navigate(ROUTES.ALBUMS);
    };

    // Функция для вызова метода "сформировать" (formUpdate)
    const handleFormUpdate = async () => {
        const resultAction = await dispatch(updateResolutionStatus());
        if (updateResolutionStatus.fulfilled.match(resultAction)) {
            setFormSuccess(true);
            // Через 3 секунды перенаправляем пользователя
            setTimeout(() => {
                navigate(ROUTES.ALBUMS);
            }, 3000);
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <div className="cart-page">
            {isLoading ? (
                <div className="album_page_loader_block">
                    <Spinner animation="border" />
                </div>
            ) : cart ? (
                <>
                    <div className="fine-cards-container">
                        {cart.fines.map((item, index) => (
                            <BasketCard
                                key={index}
                                // @ts-ignore
                                dopInf={item.description}
                                count={cart.count}
                                // @ts-ignore
                                imge={item.image}
                                // @ts-ignore
                                title={item.title}
                                // @ts-ignore
                                // @ts-ignore
                                price={item.minutes}
                                imageClickHandler={() => console.log("Нажатие на штраф с ID:", item.id)}
                                onDeleteClick={() => handleDeleteFine(item.id)}
                                onMoreClick={() => navigate(`${ROUTES.ALBUMS}/${item.id}`)}
                            />
                        ))}
                    </div>
                    {/* Кнопка "Сформировать" */}
                    <div className="action-buttons">
                        <Button onClick={handleFormUpdate} className="form-btn">
                            Сформировать
                        </Button>
                        {/* Если резолюция успешно сформирована, показываем сообщение */}
                        {formSuccess && (
                            <div className="success-message" style={{ marginTop: "10px", color: "green" }}>
                                Постановление успешно сформировано!
                            </div>
                        )}
                        {/* Форма для удаления всей резолюции */}
                        <form
                            className="delete-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleDeleteResolution();
                            }}
                            style={{ marginTop: "20px" }}
                        >
                            <Button type="submit" className="delete-btn">
                                <img
                                    //src="https://www.svgrepo.com/show/488897/delete-2.svg"
                                    alt="Удалить"
                                    className="delete-icon"
                                />
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="album_page_loader_block">
                    <Spinner animation="border" />
                </div>
            )}
        </div>
    );
};

export default CartPage;
