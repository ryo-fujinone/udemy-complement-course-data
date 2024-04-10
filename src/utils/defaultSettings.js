const getDefaultSettings = () => {
    return {
        isUfbRelatedFeaturesEnabled: true,
        ufbUrl: "https://ibmcsr.udemy.com/course/%cid/",
        isCourseDataCacheEnabled: true,
        cacheExpireHours: 48,
    };
};

export default getDefaultSettings;
