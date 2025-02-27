import { FC } from "react";
import { Card } from "react-bootstrap";
import "./MoreCard.css"; // Для стилизации
import imaged from "../DefaultImage.jpg";

interface ICardProps {
    image: string;
    title: string;
    description: string;
    minutes: number;
    answer: string; // Изображение ответа
}

export const MoreCard: FC<ICardProps> = ({
                                             image,
                                             title,
                                             description,
                                             minutes,
                                             answer,
                                         }) => {
    return (
        <Card className="moreCard">
            <div className="moreCardImageContainer">
                <Card.Img
                    className="moreCardImage"
                    variant="top"
                    src={image || imaged}
                    alt="Задание"
                />
            </div>
            <Card.Body>
                <Card.Title className="textStyleMore">{title}</Card.Title>
                <Card.Text className="detailedDescription">
                    {description}
                </Card.Text>

                {/* Добавляем изображение ответа с подписью */}
                {answer && (
                    <div className="answer-container">
                        <p className="answer-title">Ответ:</p>
                        <img className="answer-image" src={answer} alt="Ответ" />
                    </div>
                )}

                <div className="moreCardPriceButtonWrapper">
                    <div className="moreCardPrice"> {minutes} минут</div>
                </div>
            </Card.Body>
        </Card>
    );
};