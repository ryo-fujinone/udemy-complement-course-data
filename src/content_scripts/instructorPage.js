import getDefaultSettings from "../utils/defaultSettings";
import { getFromStorage } from "../utils/handleStorage";
import "./courseCard.css";

import {
    addToCourseCache,
    getCourseCache,
    organizeCourseCache,
} from "../utils/handleCache";

import {
    combineArray,
    createCardRow,
    createCardRowInner,
    createCreatedDateItem,
    createLastUpdateDateItem,
    createUfbTextItem,
    fetchDataFromApi,
    generateApiUrls,
    getPublishedTitles,
} from "../utils/createCourseInfo";

const createItems1 = (data, itemClassName) => {
    const _items = [];

    const createdDateItem = createCreatedDateItem(data.created, itemClassName);
    _items.push(createdDateItem);

    const lastUpdateDateItem = createLastUpdateDateItem(
        data.last_update_date,
        itemClassName
    );
    _items.push(lastUpdateDateItem);

    return _items.filter((item) => item);
};

const createItems2 = (data, itemClassName, settings) => {
    const _items = [];

    const ufbTextItem = createUfbTextItem(
        data.is_in_any_ufb_content_collection,
        itemClassName,
        settings
    );
    _items.push(ufbTextItem);

    return _items.filter((item) => item);
};

const createExtraInfoRow = (data, lastCardRow, settings) => {
    const cardRowClassName = lastCardRow.className;

    const cardRow1 = createCardRow(cardRowClassName);
    const cardRow2 = createCardRow(cardRowClassName);
    const innerDiv1 = createCardRowInner(cardRowClassName);
    const innerDiv2 = createCardRowInner(cardRowClassName);
    cardRow1.append(innerDiv1);
    cardRow2.append(innerDiv2);

    const items1 = createItems1(data, cardRowClassName);
    items1.forEach((item) => innerDiv1.append(item));
    const items2 = createItems2(data, cardRowClassName, settings);
    items2.forEach((item) => innerDiv2.append(item));

    lastCardRow.after(cardRow2);
    lastCardRow.after(cardRow1);
};

const addExtraInfo = (data, settings) => {
    const publishedTitle = data.published_title;
    const card = document.querySelector(
        `[data-published-title='${publishedTitle}']`
    );
    if (card === null) return;

    const cardRows = card.querySelectorAll(
        "div[class*='course-card-details-module--row--']:not(.ud-text-xs)"
    );
    let lastCardRow = cardRows[cardRows.length - 1];
    if (!lastCardRow) {
        lastCardRow = card.querySelector(
            "[class^='card-authors-module--authors--']"
        );
    }
    if (lastCardRow) {
        createExtraInfoRow(data, lastCardRow, settings);
    }
};

const getProfileObj = (profileElem) => {
    const profileJson = profileElem.dataset.moduleArgs;
    if (!profileJson) return null;
    const profile = JSON.parse(profileJson);
    return profile;
};

const main = async (settings) => {
    const cards = document.querySelectorAll(
        "section[class^='vertical-card-module--card--']"
    );

    const publishedTitles = getPublishedTitles(cards);
    const validCourseCaches = await getCourseCache(publishedTitles, settings);
    const titlesNotInCache = publishedTitles.filter((publishedTitle) => {
        return !validCourseCaches.hasOwnProperty(publishedTitle);
    });

    const apiUrls = generateApiUrls(titlesNotInCache);
    const resultValues = await fetchDataFromApi(apiUrls);
    const cacheValues = Object.values(validCourseCaches);
    const combinedValues = combineArray([resultValues, cacheValues]);

    combinedValues.forEach((value) => {
        addExtraInfo(value, settings);
    });

    await organizeCourseCache(settings);
    await addToCourseCache(combinedValues, settings);
};

(async () => {
    const profileElem = document.querySelector(
        "[data-module-id='user-profile/instructor']"
    );
    if (!profileElem) return;
    const profile = getProfileObj(profileElem);
    if (!profile) return;

    const numCourses = profile.num_courses;

    if (typeof numCourses === "number" && numCourses > 0) {
        const result = await getFromStorage(["settings"]);
        const settings = result.settings ?? getDefaultSettings();

        let firstRunMain = true;

        const detectRefresh = (container) => {
            setTimeout(() => {
                // The courseListContainer is regenerated once, so wait 1 second before moving on to runMain()
                if (container.isConnected && firstRunMain) {
                    firstRunMain = false;
                    main(settings);
                }
            }, 1000);

            new MutationObserver((mutations, _) => {
                const filtered = mutations.filter((m) => {
                    if (m.addedNodes.length !== 1) return false;
                    const node = m.addedNodes[0];
                    if (node.classList.length === 0) return false;
                    const cardAdded = node.matches(
                        "[class*='courses-module--content-grid--'] > [class^='content-grid-item-module--item--']"
                    );
                    return cardAdded;
                });
                if (filtered.length !== 0) {
                    main(settings);
                }
            }).observe(container, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        };

        const random = window.crypto.randomUUID().replaceAll("-", "");

        new MutationObserver(async (_, _observer) => {
            const containers = document.querySelectorAll(
                `[class^='with-loading-module--container--'] [class*='courses-module--content-grid--']:not([data-detected-from-ext${random}='true'])`
            );
            containers.forEach((container) => {
                container.dataset[`detectedFromExt${random}`] = "true";
                detectRefresh(container);
            });
        }).observe(document, { childList: true, subtree: true });
    }
})();
