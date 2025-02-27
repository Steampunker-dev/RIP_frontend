export const ROUTES = {
    HOME: "/",
    ALBUMS: "/tasks",
    LOGIN: "/login",
    EDIT: "/edit_fine",
    BASKET: "/basket",
    RESOLUTIONS: "/resolutions",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ALBUMS: "Задания",
    LOGIN: "Авторизация",
    EDIT: "Редактирование заданий",
    BASKET: "Корзина",
    RESOLUTIONS: "Занятия"
};