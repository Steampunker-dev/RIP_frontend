// pages/LessonsPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    startPollingLessons,
    stopPollingLessons,
    setFilters,
    setIsPolling
} from '../redux/lessonsSlice.tsx';
import LessonCard from '../components/LessonCard';
import './ResolutionsPage.css';
import { RootState } from '../redux/store'; // ваш тип корневого состояния, если используете TypeScript

const LessonsPage:React.FC = () => {
    const dispatch = useDispatch();
    const { filters, lessons,qrs, status, error } = useSelector((state: RootState) => state.lessons);
    // Если вам нужна логика для админа/пользователя, оставьте; если нет — уберите
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    // Допустим, userName в lessons у вас нет (пример был про Resolutions), тогда можно выпилить

    // Локальное состояние фильтров
    const [localDateFrom, setLocalDateFrom] = useState(filters.dateFrom);
    const [localDateTo, setLocalDateTo] = useState(filters.dateTo);
    const [localStatus, setLocalStatus] = useState(filters.status);

    // Запуск/остановка polling на монтирование/размонтирование
    useEffect(() => {
        dispatch(setIsPolling(true));
        dispatch(startPollingLessons() as any); // приведение к any из-за TS, если нужно
        return () => {
            dispatch(stopPollingLessons() as any);
        };
    }, [dispatch]);

    const handleSearch = () => {
        // Примерно как в вашем коде
        dispatch(stopPollingLessons() as any);
        dispatch(setFilters({
            dateFrom: localDateFrom,
            dateTo: localDateTo,
            status: localStatus,
        }));
        dispatch(setIsPolling(true));
        dispatch(startPollingLessons() as any);
    };

    // Если нужно фильтровать локально (по userName, и т.д.), делаем здесь.
    // У нас в JSON нет поля user, поэтому убираем логику.
    const filteredLessons = lessons; // можно делать дополнительно какую-то фильтрацию


    return (
        <div className="lessons-page">
            <div className="lessons-page__filters">
                <div className="lessons-page__filter-group">
                    <label>Дата от:</label>
                    <input
                        type="date"
                        className="lessons-page__input"
                        value={localDateFrom}
                        onChange={(e) => setLocalDateFrom(e.target.value)}
                    />
                </div>
                <div className="lessons-page__filter-group">
                    <label>Дата до:</label>
                    <input
                        type="date"
                        className="lessons-page__input"
                        value={localDateTo}
                        onChange={(e) => setLocalDateTo(e.target.value)}
                    />
                </div>
                <div className="lessons-page__filter-group">
                    <label>Статус:</label>
                    <select
                        className="lessons-page__input"
                        value={localStatus}
                        onChange={(e) => setLocalStatus(e.target.value)}
                    >
                        <option value="">Все</option>
                        <option value="черновик">Черновик</option>
                        <option value="сформирован">Сформирован</option>
                        <option value="подтвержден">Подтвержден</option>
                        <option value="отклонен">Отклонен</option>
                        {/* и т.д. — смотря что у вас возвращается на бекенде */}
                    </select>
                </div>
                <div className="lessons-page__filter-group">
                    {/* Если вам не нужно фильтрация по пользователю — удалите целиком */}
                    {isAdmin && (
                        <>
                            <label>Админ-фильтр по чему-то:</label>
                            <input
                                type="text"
                                className="lessons-page__input"
                                disabled={!isAdmin}
                            />
                        </>
                    )}
                </div>
                <div className="lessons-page__filter-group">
                    <button className="lessons-page__search-btn" onClick={handleSearch}>
                        Поиск
                    </button>
                </div>
            </div>
            <div className="lesson-cards-container">
                {status === 'failed' && <p>Ошибка: {error}</p>}
                {status === 'loading' && <p>Загрузка...</p>}
                {filteredLessons.map((lesson, index) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        // Передаём соответствующий QR, если есть:
                        qr={qrs && qrs[index]}
                    />
                ))}
            </div>
        </div>
    );
};

export default LessonsPage;