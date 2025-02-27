import React from "react";
import { Button, Form, Card } from "react-bootstrap";
import { DsFines } from "../api/Api.ts";
import "./EditCard.css"
import imaged from "../DefaultImage.jpg";

interface FineEditCardProps {
    fine: DsFines;
    onChange: (id: number, field: string, value: string | number) => void;
    onSave: (fineID: number) => void;
    onDelete: (fineID: number) => void;
    onImageUpload: (fineID: number, file: File) => void;
    isNew?: boolean;
}

export const EditCard: React.FC<FineEditCardProps> = ({
                                                              fine,
                                                              onChange,
                                                              onSave,
                                                              onDelete,
                                                              onImageUpload,
                                                              isNew = false,                                                          }) => {
    return (
        <Card key={fine.id} className="fine-edit-card">
            <Card.Img variant="top" src={fine.image || imaged} className="fine-image" />

            {/* ✅ Кнопка загрузки изображения */}
            <div className="upload-container">
                <input
                    type="file"
                    id={`file-input-${fine.id}`}
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            onImageUpload(fine.id, e.target.files[0]);
                        }
                    }}
                />
                {(isNew) ? null : (
                    <label htmlFor={`file-input-${fine.id}`} className="upload-button">
                        Изменить изображение
                    </label>
                )}
            </div>

            <Card.Body>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={fine.title}
                        onChange={(e) => onChange(fine.id, "title", e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Время</Form.Label>
                    <Form.Control
                        type="number"
                        value={fine.id}
                        onChange={(e) => onChange(fine.id, "minutes", Number(e.target.value))}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={fine.description}
                        onChange={(e) => onChange(fine.id, "fullInf", e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Доп. информация</Form.Label>
                    <Form.Control
                        type="text"
                        value={fine.dopInf}
                        onChange={(e) => onChange(fine.id, "dopInf", e.target.value)}
                    />
                </Form.Group>

                <div className="button-group">
                    <Button className="save-button" onClick={() => onSave(fine.id)}>
                        Сохранить
                    </Button>
                    <Button className="delete-button" onClick={() => onDelete(fine.id)}>
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};
