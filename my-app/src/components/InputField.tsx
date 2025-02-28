import { FC } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { useTasks } from "../context/TasksContext"; // ✅ Используем контекст
import "./InputField.css";

interface Props {
    loading?: boolean;
    value: string;
    onChange: (value: string) => void; // ✅ Передаем `onChange`
}

const InputField: FC<Props> = ({ loading, value, onChange }) => {
    return (
        <div className="inputField">
            <InputGroup className="mb-3 border-custom">
                <Form.Control
                    placeholder="Введите длительность занятия..."
                    value={value}
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    onChange={(event) => onChange(event.target.value)} // ✅ Теперь обновляем через пропсы
                    className="input-custom"
                />
                <Button
                    type="submit"
                    id="button-addon1"
                    disabled={loading}
                    onClick={() => onChange(value)} // ✅ Нажатие "Найти" теперь тоже обновляет фильтр
                    className="btn-custom"
                >
                    Найти
                </Button>
            </InputGroup>
        </div>
    );
};

export default InputField;