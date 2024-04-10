import moment from "moment/moment";

import getDefaultSettings from "../utils/defaultSettings";
import { fetchData } from "../utils/handleApi";
import { getMessage } from "../utils/handleI18n";
import { getFromStorage } from "../utils/handleStorage";
import waitForKeyElements from "../utils/waitForKeyElements";
import "./course.css";

import {
    generateCoursePathApiUrl,
    generateUdemyCourseUrl,
    generateUfbCourseUrl,
} from "../utils/generateUrl";

const fixLastUpdateDate = (lastUpdateDateStr, metaWrapper) => {
    if (!moment(lastUpdateDateStr).isValid()) return;
    const lastUpdateDate = new Date(lastUpdateDateStr).toLocaleDateString();

    const lastUpdateDateSpan = metaWrapper.querySelector(
        ".last-update-date span"
    );
    if (lastUpdateDateSpan === null) return;
    const newText = `${getMessage("lastUpdateDate")}: ${lastUpdateDate}`;
    lastUpdateDateSpan.textContent = newText;
};

const createElementItem = (itemClassName, iconEmoji, itemElem) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("clp-lead__element-item");

    const itemInner = document.createElement("div");
    itemInner.classList.add(itemClassName);
    itemWrapper.append(itemInner);

    const iconElem = document.createElement("span");
    iconElem.classList.add("extra-info-icon");
    iconElem.textContent = iconEmoji;
    itemInner.append(iconElem);

    itemInner.append(itemElem);
    return itemWrapper;
};

const addCreatedDateItem = (createdDateStr, extraInfoWrapper) => {
    if (!moment(createdDateStr).isValid()) return;
    const createdDate = new Date(createdDateStr).toLocaleDateString();

    const span = document.createElement("span");
    span.textContent = `${getMessage("createdDate")}: ${createdDate}`;

    const iconEmoji = "📅";
    const item = createElementItem("created-date", iconEmoji, span);
    extraInfoWrapper.append(item);
};

const addLastUpdateDateItem = (lastUpdateDateStr, extraInfoWrapper) => {
    if (!moment(lastUpdateDateStr).isValid()) return;
    const lastUpdateDate = new Date(lastUpdateDateStr).toLocaleDateString();

    const span = document.createElement("span");
    span.textContent = `${getMessage("lastUpdateDate")}: ${lastUpdateDate}`;

    const iconEmoji = "📅";
    const item = createElementItem("last-update-date", iconEmoji, span);
    extraInfoWrapper.append(item);
};

const addCourseLinkItemForAnotherDomain = (
    settings,
    data,
    extraInfoWrapper
) => {
    let type;
    if (window.location.host === "www.udemy.com") {
        if (!settings.isUfbRelatedFeaturesEnabled) return;
        if (!data.is_in_any_ufb_content_collection) return;
        type = "ufb";
    } else {
        type = "udemy";
    }

    const publishedTitle = data.published_title;
    if (typeof publishedTitle !== "string") return;

    const courseLink = document.createElement("a");
    const span = document.createElement("span");

    let courseUrl, textContent, iconEmoji;
    switch (type) {
        case "udemy":
            courseUrl = generateUdemyCourseUrl(publishedTitle);
            textContent = "www.udemy.com";
            iconEmoji = "👨‍🎓";
            break;
        case "ufb":
            courseUrl = generateUfbCourseUrl(settings.ufbUrl, publishedTitle);
            textContent = "Udemy Business";
            iconEmoji = "👨‍💻";
            break;
        default:
            break;
    }

    courseLink.setAttribute("href", courseUrl);
    span.textContent = textContent;
    courseLink.append(span);

    const wrapperSpan = document.createElement("span");
    wrapperSpan.append(courseLink);

    const item = createElementItem("course-link", iconEmoji, wrapperSpan);
    extraInfoWrapper.append(item);
};

const addExtraInfo = (settings, data, metaWrapper) => {
    const extraInfoWrapper = document.createElement("div");
    extraInfoWrapper.classList.add("clp-lead__element-extra");
    metaWrapper.after(extraInfoWrapper);

    addCreatedDateItem(data.created, extraInfoWrapper);
    if (document.querySelector("[class*='ud-badge-free']")) {
        /** 無料のコースには最終更新日の項目が無いため、追加する */
        addLastUpdateDateItem(data.last_update_date, extraInfoWrapper);
    }
    addCourseLinkItemForAnotherDomain(settings, data, extraInfoWrapper);
};

const main = async (settings) => {
    const body = document.querySelector("body");
    const courseId = body.dataset.clpCourseId;
    if (!courseId) return;

    const apiUrl = generateCoursePathApiUrl(courseId);
    const data = await fetchData(apiUrl);

    const metaWrapper = document.querySelector(".clp-lead__element-meta");
    fixLastUpdateDate(data.last_update_date, metaWrapper);
    addExtraInfo(settings, data, metaWrapper);
};

(async () => {
    const result = await getFromStorage(["settings"]);
    const settings = result.settings ?? getDefaultSettings();

    let canRun = true;
    let callback = (_, { settings }) => {
        if (canRun) {
            canRun = false;
            main(settings);
        }
    };

    if (window.location.host === "www.udemy.com") {
        waitForKeyElements(
            "div[class*='generic-purchase-section--main-cta-container--']",
            callback,
            { settings },
            true,
            300,
            100
        );
    } else {
        main(settings);
    }
})();
