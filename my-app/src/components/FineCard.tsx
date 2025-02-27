import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import "./FineCard.css";
import imaged from "../DefaultImage.jpg";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.tsx";

interface ICardProps {
    image: string;
    title: string;
    minutes: number;
    description: string;
    answer: string;
    imageClickHandler: () => void;
    buttonClickHandler: () => void;

}



export const FineCard: FC<ICardProps> = ({
                                             image,
                                             title,
                                             minutes,
                                             imageClickHandler,
                                             buttonClickHandler,
                                         }) => {

    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    return (
        <Card className="fineCard">
            <Card.Img className="cardImage" variant="top" src={image || imaged} onClick={imageClickHandler} />
            <Card.Body className="cardBody">
                <Card.Title className="textStyle">{title}</Card.Title>
                <div className="cardPriceButtonWrapper">
                    <div className="cardPrice">{minutes} минут</div>
                    {(!isAuthenticated) ? null : (
                        <Button className="cardButton" onClick={buttonClickHandler}>
                            Добавить
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};
