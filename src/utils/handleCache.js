import moment from "moment";

import { getFromStorage, saveToStorage } from "../utils/handleStorage";
import { getFromManifest } from "../utils/handleManifest";

const getCourseCache = async (publishedTitles, settings) => {
    if (!settings.isCourseDataCacheEnabled) return {};

    const result = await getFromStorage(["course_cache"]);
    const courseCache = result.course_cache;
    if (courseCache === undefined) return {};

    const extensionVersion = getFromManifest("version");
    const cacheExpireHours = settings.cacheExpireHours;

    const validCourseCaches = publishedTitles.reduce((obj, publishedTitle) => {
        const _course = courseCache[publishedTitle];
        if (_course === undefined) return obj;
        if (_course._extension_version !== extensionVersion) return obj;

        if (moment().diff(_course._date, "hours") < cacheExpireHours) {
            const { _date, _extension_version, ...course } = _course;
            obj[publishedTitle] = course;
        }

        return obj;
    }, {});

    return validCourseCaches;
};

const organizeCourseCache = async (settings) => {
    if (!settings.isCourseDataCacheEnabled) return;

    const result = await getFromStorage(["course_cache"]);
    const courseCache = result.course_cache;
    if (courseCache === undefined) return;

    const newCourseCache = {};
    const extensionVersion = getFromManifest("version");
    const cacheExpireHours = settings.cacheExpireHours;

    for (const key in courseCache) {
        const _course = courseCache[key];
        if (_course._extension_version !== extensionVersion) continue;
        if (moment().diff(_course._date, "hours") >= cacheExpireHours) continue;
        newCourseCache[key] = _course;
    }

    const courseCacheLen = Object.keys(courseCache).length;
    const newCourseCacheLen = Object.keys(newCourseCache).length;
    if (courseCacheLen !== newCourseCacheLen) {
        await saveToStorage({ course_cache: newCourseCache });
    }
};

const addToCourseCache = async (values, settings) => {
    if (!settings.isCourseDataCacheEnabled) return;
    if (values.length === 0) return;

    const result = await getFromStorage(["course_cache"]);
    const courseCache = result.course_cache ?? {};
    const newCourseCache = structuredClone(courseCache);
    const extensionVersion = getFromManifest("version");

    values.forEach((value) => {
        const publishedTitle = value.published_title;
        if (newCourseCache.hasOwnProperty(publishedTitle)) return;
        newCourseCache[publishedTitle] = value;
        newCourseCache[publishedTitle]._date = moment().toISOString();
        newCourseCache[publishedTitle]._extension_version = extensionVersion;
    });

    const courseCacheLen = Object.keys(courseCache).length;
    const newCourseCacheLen = Object.keys(newCourseCache).length;
    if (courseCacheLen !== newCourseCacheLen) {
        await saveToStorage({ course_cache: newCourseCache });
    }
};

const deleteCache = async () => {
    await saveToStorage({ course_cache: {} });
};

export { getCourseCache, organizeCourseCache, addToCourseCache, deleteCache };
