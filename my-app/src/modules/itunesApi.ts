export interface Fine {
    fineID: number;
    title: string;
    fullInf: string,
    price: number;
    imge: string;
    dopInf: string;
}
export interface finesResult {
    fines: Fine[];
    resCount: number;
    resId: number;
}

export const getAlbumById = async (
    id: number | string
): Promise<Fine> => {
    return fetch(`http://localhost:8080/task/${id}`)
        .then((response) => response.json())
       .then((data) => data.cards); // Извлекаем поле cards

};