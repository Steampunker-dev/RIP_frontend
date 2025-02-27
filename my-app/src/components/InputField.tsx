import { FC } from 'react';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import {getFinesList, setSearchValue} from '../redux/fineSlice.tsx';
import './InputField.css';

interface Props {
    loading?: boolean;
    value: string
}

const InputField: FC<Props> = ({ loading,  value}) => {

    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="inputField">
            <InputGroup className="mb-3 border-custom">
                <Form.Control
                    placeholder="Введите длительность занятия..."
                    value={value}
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    onChange={(event) => dispatch(setSearchValue(event.target.value))}
                    className="input-custom"
                />
                <Button
                    type="submit"
                    id="button-addon1"
                    disabled={loading}
                    onClick={() => dispatch(getFinesList())}
                    className="btn-custom"
                >
                    Найти
                </Button>
            </InputGroup>
        </div>
    );
};

export default InputField;
