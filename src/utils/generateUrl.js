import { apiUrl, courseTargetKeys, taughtCourseTargetKeys } from "./handleApi";
import getDefaultSettings from "./defaultSettings";

const generateUdemyCourseUrl = (publishedTitle) => {
    const url = `https://www.udemy.com/course/${publishedTitle}/`;
    return url;
};

const generateUfbCourseUrl = (ufbUrlSetting, publishedTitle) => {
    let _ufbUrlSetting = ufbUrlSetting;
    if (!ufbUrlSetting || ufbUrlSetting.indexOf("%cid") === -1) {
        _ufbUrlSetting = getDefaultSettings().ufbUrl;
    }
    const url = _ufbUrlSetting.replace("%cid", publishedTitle);
    return url;
};

const generateCoursePathApiUrl = (courseId) => {
    const targetKeysStr = courseTargetKeys.join(",");
    const url = `${apiUrl}courses/${courseId}/?fields[course]=${targetKeysStr}`;
    return url;
};

const generateTaughtCousesPathApiUrl = (userId) => {
    const targetKeysStr = taughtCourseTargetKeys.join(",");
    let url = `${apiUrl}users/${userId}/taught-profile-courses/`;
    url += "?page=1&organizationCoursesOnly=false&";
    url = `${url}fields[course]=${targetKeysStr}`;
    url += "&filter_hq_courses=true";
    url += "&ordering=lang,-ds_course_feature__revenue_30days";
    url += "&page_size=999";
    return url;
};

export {
    generateUdemyCourseUrl,
    generateUfbCourseUrl,
    generateCoursePathApiUrl,
    generateTaughtCousesPathApiUrl,
};
