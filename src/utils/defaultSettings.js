const getDefaultSettings = () => {
    return {
        isUfbRelatedFeaturesEnabled: true,
        ufbUrl: "https://ibmcsr.udemy.com/course/%cid/",
        shouldWaitForShareBtnInUfb: true,
        isCourseDataCacheEnabled: true,
        cacheExpireHours: 48,
    };
};

export default getDefaultSettings;
