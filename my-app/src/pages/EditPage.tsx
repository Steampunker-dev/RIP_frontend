import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getFinesList, updateFine, deleteFine, uploadFineImage, createFine } from "../redux/taskSlice.tsx";
import { EditCard } from "../components/EditCard";
import "./EditPage.css";
import {DsTasks} from "../api/Api.ts";

const FineEditPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Загружаем список штрафов из Redux-хранилища
    const { tasks, loading } = useSelector((state: RootState) => state.tasks);

    // Локальное состояние для редактируемых данных
    const [editedFines, setEditedFines] = useState(tasks);
    const [newFine, setNewFine] = useState<DsTasks | null>(null); // Для нового штрафа

    useEffect(() => {
        dispatch(getFinesList());
    }, [dispatch]);

    useEffect(() => {
        setEditedFines(tasks);
    }, [tasks]);

    // ✅ Обработчик изменения полей
    const handleChange = (id: number, field: string, value: string | number) => {
        if (newFine && newFine.id === id) {
            setNewFine({ ...newFine, [field]: value });
        } else {
            setEditedFines((prevTask) =>
                prevTask.map((task) =>
                    task.id === id ? { ...task, [field]: value } : task
                )
            );
        }
    };

    // ✅ Обработчик сохранения изменений (для редактирования)
    const handleSave = (taskID: number) => {
        const updatetask = editedFines.find((task) => task.id === taskID);
        if (updatetask) {
            dispatch(updateFine({ id: taskID, task: updatetask }));
        }
    };

    const handleDelete = (fineID: number) => {
        dispatch(deleteFine(fineID));
    };

    // ✅ Обработчик загрузки изображения
    const handleImageUpload = (fineID: number, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        dispatch(uploadFineImage({ fineID, formData }));
    };

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

    const handleSaveNewFine = () => {
        if (newFine) {
            dispatch(createFine(newFine)).then(() => {
                setNewFine(null); // Очистка формы после создания
                dispatch(getFinesList()); // Обновляем список штрафов
            });
        }
    };

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
                            task={newFine}
                            onChange={handleChange}
                            onSave={handleSaveNewFine}
                            onDelete={handleCancelNewFine} // Отмена добавления штрафа
                            onImageUpload={() => {
                            }} // Изображение загружается только после создания
                            isNew={true} // Доп. пропс для стилизации
                        />
                    )}
                    {editedFines.map((task) => (
                        <EditCard
                            key={task.id}
                            task={task}
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
