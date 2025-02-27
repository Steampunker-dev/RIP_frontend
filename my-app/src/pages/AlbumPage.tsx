import "./AlbumPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs.tsx";
import { ROUTES, ROUTE_LABELS } from "../modules/Routes.tsx";
import { useParams } from "react-router-dom";
import { Fine, getAlbumById } from "../modules/itunesApi";
import { Spinner } from "react-bootstrap";
import { ALBUMS_MOCK } from "../modules/mock.ts";
import {MoreCard} from "../components/MoreCard.tsx";


export const AlbumPage: FC = () => {
    const [pageData, setPageData] = useState<Fine>();
    const { id } = useParams(); // ид страницы, пример: "/albums/12"

    useEffect(() => {
        if (!id) return;
        getAlbumById(id)
            .then((response) => setPageData(response))
            .catch(
                () =>
                    setPageData(
                        ALBUMS_MOCK.fines.find(
                            (fine) => String(fine.fineID) == id
                        )
                    ) /* В случае ошибки используем мок данные, фильтруем по ид */
            );
    }, [id]);

    return (
        <div>
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.ALBUMS, path: ROUTES.ALBUMS },
                    { label: pageData?.title || "Задание" },
                ]}
            />
            {pageData ? ( // проверка на наличие данных, иначе загрузка


                <div className="container">

                    <MoreCard
                        {...pageData}
                    />

                </div>
            ) : (
                <div className="album_page_loader_block">{/* загрузка */}
                    <Spinner animation="border" />
                </div>
            )}
        </div>
    );
};