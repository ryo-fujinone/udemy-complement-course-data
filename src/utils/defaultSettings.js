const getDefaultSettings = () => {
    return {
        isUfbRelatedFeaturesEnabled: true,
        ufbUrl: "https://ibmcsr.udemy.com/course/%cid/",
        shouldWaitForShareBtnInUfb: true,
        waitingTimeForPageNumChange: 3000,
        isCourseDataCacheEnabled: true,
        cacheExpireHours: 48,
    };
};

export default getDefaultSettings;
