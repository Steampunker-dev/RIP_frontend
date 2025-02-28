import { FC } from "react";
import "./BasketCard.css";
import imaged from "../DefaultImage.jpg";


interface IBasketCardProps {
    dopInf: string;
    imge: string;
    title: string;
    fullInf: string;
    price: number;
    count?: number;
    id: string;
    imageClickHandler: () => void;
    onDeleteClick: () => void; /* Функция для удаления */
    onMoreClick: () => void;

}

export const BasketCard: FC<IBasketCardProps> = ({
                                                     dopInf,
                                                     imge,
                                                     title,
                                                     price,
                                                     count,
                                                     id,
                                                     imageClickHandler,
                                                     onDeleteClick,
                                                     onMoreClick,
                                                 }) => {
    return (
        <div className="basketCardContainer" id={id}>
            <div className="basketCardImage" onClick={imageClickHandler}>
                <img
                    className="basketCardImg"
                    src={imge || imaged}
                    alt={title}
                />
            </div>

            <div className="basketCardContent">
                <h5 className="basketCardTitle">{title}</h5>
                <div className="basketCardButtonWrapper">
                    <a onClick={onMoreClick} className="basketCardLink">
                        Подробнее
                    </a>
                    <button className="basketCardDelete" onClick={onDeleteClick}>
                        Удалить
                    </button>
                </div>
            </div>

            <div className="basketCardInfo">
                <p>{dopInf} {count}</p>
                <div className="basketCardPrice">{price}минут


                </div>



            </div>
        </div>
    );
};
