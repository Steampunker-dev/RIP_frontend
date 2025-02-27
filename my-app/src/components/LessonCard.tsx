// components/LessonCard.tsx
import React from 'react';
import './LessonCard.css';

// Интерфейс урока
interface Lesson {
    id: number;
    lesson: string;
    date_created: string;
    date_formed: string;
    date_accepted: string;
    status: string;
    lesson_date: string;
    lesson_type: string;
}

interface LessonCardProps {
    lesson: Lesson;
    qr?: string; // <-- Добавили поле для qr
}

// Универсальная функция для форматирования дат (оставляем как есть)
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || dateStr.startsWith('0001')) {
        return 'Не указано';
    }
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, qr }) => {
    const {
        id,
        lesson: lessonName,
        date_created,
        date_formed,
        date_accepted,
        status,
        lesson_date,
        lesson_type,
    } = lesson;
    return (
        <div className="lesson-card">
            <h3 className="lesson-card__title">Занятие #{id}</h3>
            <div className="lesson-card__body">
                <p><strong>Название урока:</strong> {lessonName}</p>
                <p><strong>Статус:</strong> {status}</p>
                <p><strong>Дата создания:</strong> {formatDate(date_created)}</p>
                <p><strong>Дата формирования:</strong> {formatDate(date_formed)}</p>
                <p><strong>Дата принятия:</strong> {formatDate(date_accepted)}</p>
                <p><strong>Дата занятия:</strong> {formatDate(lesson_date)}</p>
                <p><strong>Тип занятия:</strong> {lesson_type}</p>

                {/* Если qr есть, отображаем его */}
                {qr && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <img
                            src={`data:image/png;base64,${qr}`}
                            alt={`QR for lesson #${id}`}
                            style={{ width: '150px', height: '150px' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonCard;