import getDefaultSettings from "../utils/defaultSettings";
import { generateUfbCourseUrl } from "../utils/generateUrl";
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
        "[class*='course-card-module--image-container--'], [class*='course-card_image-container']"
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

    const regex = /^https:\/\/www\.udemy\.com\/courses\/search\/.*/;
    if (!regex.test(window.location.href)) {
        setUfbLink(data, card, settings);
    }
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
        "div[class*='course-card-details-module--row--']:not(.ud-text-xs), div[class*='course-card-details_row']:has(> div[class*='course-card-details_course-meta-info'])"
    );
    let lastCardRow = cardRows[cardRows.length - 1];
    if (!lastCardRow) {
        //  Search result page for 'www.udemy.com'
        lastCardRow = card.querySelector(
            "[class^='card-authors-module--authors--']"
        );
    }
    if (lastCardRow) {
        createExtraInfoRow(data, lastCardRow, card, settings);
    }
};

const getCards1 = () => {
    return new Promise((resolve, reject) => {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            // selector -> for non-topic pages, for topic page
            const cards = document.querySelectorAll(
                "div[class*='course-card-module--container']:not([class*='course-card-module--medium--']):not([class*='bundle-unit--bundle-course-card--']), div[class*='course-card_container']:not([class*='bundle-unit']):not([class*='course-card_medium'])"
            );
            const filteredCards = Array.from(cards).filter((card) => {
                if (card.querySelector("[data-purpose='course-extra-info']")) {
                    return false;
                }
                return true;
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

const getCards2 = () => {
    const cards = document.querySelectorAll(
        "[class^='search--search-course-card'][id]"
    );
    const filteredCards = Array.from(cards).filter((card) => {
        if (card.querySelector("[data-purpose='course-extra-info']")) {
            return false;
        }
        return true;
    });
    return filteredCards;
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

const prepare1 = async (settings) => {
    const runMain = (settings) => {
        getCards1()
            .then((cards) => {
                try {
                    main(settings, cards);
                } catch (e) {
                    console.error(e);
                }
            })
            .catch((e) => {});
    };

    const detectRefresh = (courseListContainer) => {
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
                        /^course-list--card-layout-container/.test(className)
                    )
                ) {
                    // www.udemy.com
                    // When using pagination with "https://*.udemy.com/courses/*/*"
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
                        /^course-list_card-layout-container/.test(className)
                    )
                ) {
                    // topic page
                    return true;
                }
                return false;
            });
            if (filtered.length !== 0) {
                runMain(settings);
            }
        }).observe(courseListContainer, { childList: true, subtree: true });
    };

    new MutationObserver((_, _observer) => {
        const courseListContainer = document.querySelector(
            "div[class*='course-list--container'], div[class*='course-list_container']"
        );
        if (!courseListContainer) return;
        _observer.disconnect();

        detectRefresh(courseListContainer);
        runMain(settings);
    }).observe(document, { childList: true, subtree: true });
};

const prepare2 = (settings) => {
    const runMain = (settings) => {
        const cards = getCards2();
        if (cards.length > 0) {
            main(settings, cards);
        }
    };

    let firstRunMain = true;

    const detectRefresh = (courseListContainer) => {
        setTimeout(() => {
            // The courseListContainer is regenerated once, so wait 1 second before moving on to runMain()
            if (courseListContainer.isConnected && firstRunMain) {
                firstRunMain = false;
                runMain(settings);
            }
        }, 1000);

        new MutationObserver((mutations, _) => {
            const filtered = mutations.filter((m) => {
                if (m.addedNodes.length !== 1) return false;
                const node = m.addedNodes[0];
                if (node.classList.length === 0) return false;
                const cardAdded = node.matches(
                    "[class^='search--search-course-card'][id] [class^='prefetching-wrapper-module--prefetching-wrapper']"
                );
                return cardAdded;
            });
            if (filtered.length !== 0) {
                runMain(settings);
            }
        }).observe(courseListContainer, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    };

    const random = window.crypto.randomUUID().replaceAll("-", "");

    new MutationObserver((_, _observer) => {
        const courseListContainers = document.querySelectorAll(
            `div[class*='course-list--container']:not([data-detected-from-ext${random}='true'])`
        );
        courseListContainers.forEach((container) => {
            container.dataset[`detectedFromExt${random}`] = "true";
            detectRefresh(container);
        });
    }).observe(document, { childList: true, subtree: true });
};

(async () => {
    const result = await getFromStorage(["settings"]);
    const settings = result.settings ?? getDefaultSettings();

    const regex = /^https:\/\/www\.udemy\.com\/courses\/search\/.*/;
    if (!regex.test(window.location.href)) {
        prepare1(settings);
    } else {
        prepare2(settings);
    }
})();
