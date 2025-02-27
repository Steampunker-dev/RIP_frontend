import React from "react";
import { Button, Form, Card } from "react-bootstrap";
import { DsTasks } from "../api/Api.ts";
import "./EditCard.css"
import imaged from "../DefaultImage.jpg";

interface FineEditCardProps {
    task: DsTasks;
    onChange: (id: number, field: string, value: string | number) => void;
    onSave: (fineID: number) => void;
    onDelete: (fineID: number) => void;
    onImageUpload: (fineID: number, file: File) => void;
    isNew?: boolean;
}

export const EditCard: React.FC<FineEditCardProps> = ({
                                                              task,
                                                              onChange,
                                                              onSave,
                                                              onDelete,
                                                              onImageUpload,
                                                              isNew = false,                                                          }) => {
    return (
        <Card key={task.id} className="fine-edit-card">
            <Card.Img variant="top" src={task.image || imaged} className="fine-image" />

            {/* ✅ Кнопка загрузки изображения */}
            <div className="upload-container">
                <input
                    type="file"
                    id={`file-input-${task.id}`}
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            onImageUpload(task.id, e.target.files[0]);
                        }
                    }}
                />
                {(isNew) ? null : (
                    <label htmlFor={`file-input-${task.id}`} className="upload-button">
                        Изменить изображение
                    </label>
                )}
            </div>

            <Card.Body>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={task.title}
                        onChange={(e) => onChange(task.id, "title", e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Время</Form.Label>
                    <Form.Control
                        type="number"
                        value={task.id}
                        onChange={(e) => onChange(task.id, "minutes", Number(e.target.value))}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={task.description}
                        onChange={(e) => onChange(task.id, "fullInf", e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Доп. информация</Form.Label>
                    <Form.Control
                        type="text"
                        value={task.description}
                        onChange={(e) => onChange(task.id, "dopInf", e.target.value)}
                    />
                </Form.Group>

                <div className="button-group">
                    <Button className="save-button" onClick={() => onSave(task.id)}>
                        Сохранить
                    </Button>
                    <Button className="delete-button" onClick={() => onDelete(task.id)}>
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};
