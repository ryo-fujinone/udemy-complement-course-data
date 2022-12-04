import moment from "moment";

import { generateCoursePathApiUrl } from "./generateUrl";
import { fetchData } from "./handleApi";
import { getMessage } from "./handleI18n";

const generateApiUrls = (publishedTitles) => {
    const apiUrls = publishedTitles.map((publishedTitle) => {
        return generateCoursePathApiUrl(publishedTitle);
    });
    return apiUrls;
};

const fetchDataFromApi = async (apiUrls) => {
    const results = await Promise.allSettled(
        apiUrls.map((apiUrl) => fetchData(apiUrl))
    );
    const fulfilledResults = results.filter(
        (results) => results.status === "fulfilled"
    );
    const values = fulfilledResults.map((results) => results.value);
    return values;
};

const getPublishedTitles = (cards) => {
    const publishedTitleRegex = /^\/course\/(.+)\/$/;
    const publishedTitles = [];
    cards.forEach((card) => {
        const linkElem = card.querySelector(
            "[data-purpose='course-title-url'] a"
        );
        const href = linkElem.getAttribute("href");
        const match = href.match(publishedTitleRegex);
        if (match.length === 2) {
            const publishedTitle = match[1];
            publishedTitles.push(publishedTitle);
            card.dataset.publishedTitle = publishedTitle;
        }
    });
    return publishedTitles;
};

const combineArray = (arrys = []) => {
    const newArry = arrys.reduce((accu, curr) => {
        const _arry = structuredClone(curr);
        return accu.concat(_arry);
    }, []);
    return newArry;
};

const createItem = (itemContent, itemClassName, itemName) => {
    const item = document.createElement("span");
    item.classList.add(itemClassName, "extra-info-item");
    if (itemName) item.dataset.itemName = itemName;
    item.append(itemContent);
    return item;
};

const createCreatedDateItem = (createdDateStr, itemClassName) => {
    if (!moment(createdDateStr).isValid()) return;
    const createdDate = new Date(createdDateStr).toLocaleDateString();

    const itemContent = `${getMessage("createdDate")}: ${createdDate}`;
    const item = createItem(itemContent, itemClassName, "created-date");
    return item;
};

const createLastUpdateDateItem = (lastUpdateDateStr, itemClassName) => {
    if (!moment(lastUpdateDateStr).isValid()) return;
    const lastUpdateDate = new Date(lastUpdateDateStr).toLocaleDateString();

    const itemContent = `${getMessage("lastUpdateDate")}: ${lastUpdateDate}`;
    const item = createItem(itemContent, itemClassName, "last-update-date");
    return item;
};

const createUfbTextItem = (isUfbContent, itemClassName, settings) => {
    if (!isUfbContent) return;
    if (window.location.host !== "www.udemy.com") return;
    if (!settings.isUfbRelatedFeaturesEnabled) return;

    const itemContent = "Udemy Business";
    const item = createItem(itemContent, itemClassName, "ufb-content-label");
    return item;
};

const createCardRow = (cardRowClassName) => {
    const cardRow = document.createElement("div");
    cardRow.classList.add(cardRowClassName);
    return cardRow;
};

const createCardRowInner = (cardRowClassName) => {
    const innerDiv = document.createElement("div");
    innerDiv.classList.add(cardRowClassName, "ud-text-xs", "udlite-text-xs");
    innerDiv.dataset.purpose = "course-extra-info";
    return innerDiv;
};

export {
    generateApiUrls,
    fetchDataFromApi,
    getPublishedTitles,
    combineArray,
    createCreatedDateItem,
    createLastUpdateDateItem,
    createUfbTextItem,
    createCardRow,
    createCardRowInner,
};
