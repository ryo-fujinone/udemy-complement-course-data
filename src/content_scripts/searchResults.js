import "./courseCard.css";
import getDefaultSettings from "../utils/defaultSettings";
import waitForKeyElements from "../utils/waitForKeyElements";
import { generateUfbCourseUrl } from "../utils/generateUrl";
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

const createItems = (data, itemClassName, settings) => {
    const _items = [];

    const createdDateItem = createCreatedDateItem(data.created, itemClassName);
    _items.push(createdDateItem);

    const lastUpdateDateItem = createLastUpdateDateItem(
        data.last_update_date,
        itemClassName
    );
    _items.push(lastUpdateDateItem);

    const ufbTextItem = createUfbTextItem(
        data.is_in_any_ufb_content_collection,
        itemClassName,
        settings
    );
    _items.push(ufbTextItem);

    return _items.filter((item) => item);
};

const setCourseLinkStyle = (imgWrapper) => {
    if (document.querySelector(".style__img-not-included") !== null) return;

    const widthThreshold = 600;

    const setStyle = (css) => {
        const cssText = document.createTextNode(css);
        const style = document.createElement("style");
        style.classList.add("style__img-not-included");
        style.appendChild(cssText);
        document.querySelector("head").append(style);
    };

    function setPcStyle() {
        if (window.innerWidth > widthThreshold) {
            const img = imgWrapper.querySelector("img");
            const css = `a.img-not-included::after {
                                        left: ${img.clientWidth}px !important;
                                    }`;
            setStyle(css);
            if (this !== undefined) {
                this.removeEventListener("resize", setPcStyle);
            }
        }
    }

    function setMediaQueryStyle() {
        if (window.innerWidth <= widthThreshold) {
            const img = imgWrapper.querySelector("img");
            const css = `@media screen and (max-width:600px) {
                                        a.img-not-included::after {
                                            left: ${img.clientWidth}px !important;
                                        }
                                    }`;
            setStyle(css);
            if (this !== undefined) {
                this.removeEventListener("resize", setMediaQueryStyle);
            }
        }
    }

    if (window.innerWidth > widthThreshold) {
        setPcStyle();
        window.addEventListener("resize", setMediaQueryStyle);
    } else {
        setMediaQueryStyle();
        window.addEventListener("resize", setPcStyle);
    }
};

const setUfbLink = (data, card, settings) => {
    if (window.location.host !== "www.udemy.com") return;
    if (!settings.isUfbRelatedFeaturesEnabled) return;

    const isUfbContent = data.is_in_any_ufb_content_collection;
    const publishedTitle = data.published_title;
    if (!isUfbContent || typeof publishedTitle !== "string") return;

    const linkElem = card.querySelector("[data-purpose='course-title-url'] a");
    linkElem.classList.add("img-not-included");

    const ufbLink = document.createElement("a");
    const ufbCourseUrl = generateUfbCourseUrl(settings.ufbUrl, publishedTitle);
    ufbLink.setAttribute("href", ufbCourseUrl);
    ufbLink.setAttribute("target", "_blank");

    // selector -> for non-topic pages, for topic page
    const imgWrapper = card.querySelector(
        "[class*='course-card-module--image-container--'], [class*='course-card_image-wrapper']"
    );
    imgWrapper.append(ufbLink);
    const img = imgWrapper.querySelector("img");
    ufbLink.appendChild(img);

    setCourseLinkStyle(imgWrapper);
};

const createExtraInfoRow = (data, lastCardRow, card, settings) => {
    const cardRowClassName = lastCardRow.className;

    const cardRow = createCardRow(cardRowClassName);
    const innerDiv = createCardRowInner(cardRowClassName);
    cardRow.append(innerDiv);

    const items = createItems(data, cardRowClassName, settings);
    items.forEach((item) => innerDiv.append(item));

    lastCardRow.after(cardRow);

    setUfbLink(data, card, settings);
};

const addExtraInfo = (data, settings) => {
    const publishedTitle = data.published_title;
    const card = document.querySelector(
        `[data-published-title='${publishedTitle}']`
    );
    if (card === null) return;
    if (card.querySelector("[data-purpose='course-extra-info']")) return;

    // selector -> for non-topic pages, for topic page
    const cardRows = card.querySelectorAll(
        "div[class*='course-card-details-module--row--']:not(.ud-text-xs), div[class*='course-card_row']:has(> div[class*='course-card_course-meta-info'])"
    );
    const lastCardRow = cardRows[cardRows.length - 1];
    createExtraInfoRow(data, lastCardRow, card, settings);
};

const getCards = () => {
    return new Promise((resolve, reject) => {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            // selector -> for non-topic pages, for topic page
            const cards = document.querySelectorAll(
                "div[class*='course-card-module--container']:not([class*='course-card-module--medium--']):not([class*='bundle-unit--bundle-course-card--']), div[class*='course-card_container']:not([class*='bundle-unit']):not([class*='course-card_medium'])"
            );
            const filteredCards = Array.from(cards).filter((card) => {
                if (!card.querySelector("[data-purpose='course-extra-info']")) {
                    return true;
                }
            });
            if (filteredCards.length === 0) {
                reject();
                return;
            }
            try {
                const card0ImgSrc = cards[0]
                    ?.querySelector("img")
                    ?.getAttribute("src");
                if (card0ImgSrc.indexOf("data:") !== 0) {
                    clearInterval(interval);
                    resolve(cards);
                } else if (count >= 100) {
                    clearInterval(interval);
                    reject();
                }
            } catch (e) {
                clearInterval(interval);
                reject();
            }
        }, 100);
    });
};

const main = async (settings, cards) => {
    const publishedTitles = getPublishedTitles(cards);
    if (publishedTitles.length === 0) return;

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
    const result = await getFromStorage(["settings"]);
    const settings = result.settings ?? getDefaultSettings();

    const runMain = (settings) => {
        getCards()
            .then((cards) => {
                try {
                    main(settings, cards);
                } catch (e) {
                    console.error(e);
                }
            })
            .catch((e) => {});
    };

    const detectRefresh = (watchedNode) => {
        new MutationObserver((mutations, _) => {
            const filtered = mutations.filter((m) => {
                if (m.addedNodes.length !== 1) return false;
                const node = m.addedNodes[0];
                if (node.classList.length === 0) return false;
                if (
                    Array.from(node.classList).some((className) =>
                        /^popper-module--popper/.test(className)
                    )
                ) {
                    // www.udemy.com
                    return true;
                } else if (
                    Array.from(node.classList).some((className) =>
                        /^course-list-context-menu/.test(className)
                    )
                ) {
                    // ibmcsr.udemy.com
                    return true;
                } else if (
                    Array.from(node.classList).some((className) =>
                        /^popper_popper__/.test(className)
                    )
                ) {
                    // topic page
                    return true;
                }
            });
            if (filtered.length !== 0) {
                runMain(settings);
            }
        }).observe(watchedNode, {
            childList: true,
            subtree: true,
        });
    };

    const run = () => {
        const callback = (targetNode, { settings }) => {
            detectRefresh(targetNode);
            runMain(settings);
        };

        // selector -> for non-topic pages, for topic page
        waitForKeyElements(
            "div[class*='course-list--container'], div[class*='course-list_container']",
            callback,
            { settings },
            true,
            300,
            100
        );
    };

    run();
})();
