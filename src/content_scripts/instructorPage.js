import "./courseCard.css";
import getDefaultSettings from "../utils/defaultSettings";
import waitForKeyElements from "../utils/waitForKeyElements";
import { getFromStorage } from "../utils/handleStorage";

import {
    getCourseCache,
    organizeCourseCache,
    addToCourseCache,
} from "../utils/handleCache";

import {
    generateApiUrls,
    fetchDataFromApi,
    getPublishedTitles,
    combineArray,
    createCreatedDateItem,
    createLastUpdateDateItem,
    createUfbTextItem,
    createCardRow,
    createCardRowInner,
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
    const lastCardRow = cardRows[cardRows.length - 1];
    createExtraInfoRow(data, lastCardRow, settings);
};

const getProfileObj = (profileElem) => {
    const profileJson = profileElem.dataset.moduleArgs;
    if (!profileJson) return null;
    const profile = JSON.parse(profileJson);
    return profile;
};

const main = async (settings) => {
    const cards = document.querySelectorAll(
        "[class*='instructor-courses--course-card-container--']"
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

        const run = () => {
            let canRun = true;
            const callback = (_, { settings }) => {
                if (canRun) {
                    canRun = false;
                    try {
                        let _canRun = true;
                        waitForKeyElements(
                            "[data-purpose='course-title-url']",
                            () => {
                                if (_canRun) {
                                    _canRun = false;
                                    main(settings);
                                }
                            },
                            {},
                            true,
                            10,
                            100
                        );
                    } catch (e) {
                        console.error(e);
                    }
                }
            };
            waitForKeyElements(
                "[class*='instructor-courses--course-card-container--']",
                callback,
                { settings },
                true,
                100,
                1000
            );
        };
        run();

        const waitForPageNumChange = () => {
            const callback = (a) => {
                a.addEventListener("click", () => {
                    setTimeout(() => {
                        run();
                    }, settings.waitingTimeForPageNumChange);
                });
            };

            waitForKeyElements(
                "[class*='pagination-module--container--'] a",
                callback,
                {},
                false,
                2000
            );
        };
        waitForPageNumChange();
    }
})();
