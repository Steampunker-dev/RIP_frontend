import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getFinesList, updateFine, deleteFine, uploadFineImage, createFine } from "../redux/fineSlice";
import { EditCard } from "../components/EditCard";
import "./EditPage.css";
import {DsFines} from "../api/Api.ts";

const FineEditPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Загружаем список штрафов из Redux-хранилища
    const { fines, loading } = useSelector((state: RootState) => state.fines);

    // Локальное состояние для редактируемых данных
    const [editedFines, setEditedFines] = useState(fines);
    const [newFine, setNewFine] = useState<DsFines | null>(null); // Для нового штрафа

    useEffect(() => {
        dispatch(getFinesList());
    }, [dispatch]);

    useEffect(() => {
        setEditedFines(fines);
    }, [fines]);

    // ✅ Обработчик изменения полей
    const handleChange = (id: number, field: string, value: string | number) => {
        if (newFine && newFine.id === id) {
            setNewFine({ ...newFine, [field]: value });
        } else {
            setEditedFines((prevFines) =>
                prevFines.map((fine) =>
                    fine.id === id ? { ...fine, [field]: value } : fine
                )
            );
        }
    };

    // ✅ Обработчик сохранения изменений (для редактирования)
    const handleSave = (fineID: number) => {
        const updatedFine = editedFines.find((fine) => fine.id === fineID);
        if (updatedFine) {
            dispatch(updateFine({ id: fineID, fine: updatedFine }));
        }
    };

    // ✅ Обработчик удаления штрафа
    const handleDelete = (fineID: number) => {
        dispatch(deleteFine(fineID));
    };

    // ✅ Обработчик загрузки изображения
    const handleImageUpload = (fineID: number, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        dispatch(uploadFineImage({ fineID, formData }));
    };

    // ✅ Добавление нового штрафа
    const handleAddFine = () => {
        setNewFine({
            id: Date.now(), // Временный ID до создания на сервере
            title: "",
            minutes: 0,
            description: "",
            answer: "",
            image: "",
        });
    };

    // ✅ Сохранение нового штрафа
    const handleSaveNewFine = () => {
        if (newFine) {
            dispatch(createFine(newFine)).then(() => {
                setNewFine(null); // Очистка формы после создания
                dispatch(getFinesList()); // Обновляем список штрафов
            });
        }
    };

    // ✅ Отмена добавления нового штрафа
    const handleCancelNewFine = () => {
        setNewFine(null);
    };

    return (
        <div className="fine-edit-page">
            <div className="add-btn-container">
                <button className="add-btn" onClick={handleAddFine}>
                    <img src="https://www.svgrepo.com/show/510785/add-plus.svg"/>
                </button>
            </div>

            {loading ? (
                <Spinner animation="border"/>
            ) : (
                <>
                    {newFine && (
                        <EditCard
                            fine={newFine}
                            onChange={handleChange}
                            onSave={handleSaveNewFine}
                            onDelete={handleCancelNewFine} // Отмена добавления штрафа
                            onImageUpload={() => {
                            }} // Изображение загружается только после создания
                            isNew={true} // Доп. пропс для стилизации
                        />
                    )}
                    {editedFines.map((fine) => (
                        <EditCard
                            key={fine.id}
                            fine={fine}
                            onChange={handleChange}
                            onSave={handleSave}
                            onDelete={handleDelete}
                            onImageUpload={handleImageUpload}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default FineEditPage;
