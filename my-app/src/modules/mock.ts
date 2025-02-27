import {tasksResult} from "./itunesApi.ts";

export const ALBUMS_MOCK: tasksResult = {
    tasks: [
        {
            taskID: 1,
            title: "\"Номер 3828 Демидович\"",
            description: "Как и на велосипеде, на самокате запрещено ехать по пешеходным переходам — необходимо спешиться и катить СИМ в руках.",
            minutes: 20,
            imge: "http://127.0.0.1:9000/fines-bucket/1.png",
            dopInf: "Колличество:"
        },
        {
            taskID: 2,
            title: "\"Номер 3805 Демидович\"",
            description: "На электросамокатах запрещено перевозить пассажиров, то есть ездить вдвоем на одном транспорте нельзя.",
            minutes: 10,
            imge: "http://127.0.0.1:9000/fines-bucket/2.png",
            dopInf: "Колличество людей на самокате:"
        },
        {
            taskID: 3,
            title: "\"Номер 3801 Демидович\"",
            description: "Водить арендные самокаты можно только с 18 лет.",
            minutes: 50,
            imge: "http://127.0.0.1:9000/fines-bucket/3.png",
            dopInf: "Возраст ребенка:"
        },
        {
            taskID: 4,
            title: "\"Номер 3801 Демидович\"",
            description: "Запрещено передвигаться на электросамокате в нетрезвом виде.",
            minutes: 30,
            imge: "http://127.0.0.1:9000/fines-bucket/4.png",
            dopInf: "Скорость:"
        },
        {
            taskID: 5,
            title: "\"Номер 3801 Демидович\"",
            description: "Запрещено передвигаться на электросамокате в нетрезвом виде.",
            minutes: 20,
            imge: "http://127.0.0.1:9000/fines-bucket/5.png",
            dopInf: "Промилле:"
        },
        {
            taskID: 6,
            title: "\"Номер 3801 Демидович\"",
            description: "Запрещено передвигаться на электросамокате в нетрезвом виде.",
            minutes: 40,
            imge: "http://127.0.0.1:9000/fines-bucket/6.png",
            dopInf: "Колличество транспортных средств:"
        }
    ],
    resCount: 10,
    resId: 0
};
