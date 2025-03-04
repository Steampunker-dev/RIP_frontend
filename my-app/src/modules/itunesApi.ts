export interface Task {
    taskID: number;
    title: string;
    description: string,
    minutes: number;
    imge: string;
    dopInf: string;
}
export interface tasksResult {
    tasks: Task[];
    resCount: number;
    resId: number;
}

export const getAlbumById = async (
    id: number | string
): Promise<Task> => {
    return fetch(`http://localhost:8080/task/${id}`)
        .then((response) => response.json())
       .then((data) => data.cards); // Извлекаем поле cards

};