import React from "react";

import {
    updateIsCacheEnabled,
    updateCacheExpireHours,
} from "../../store/modules/settings";
import { getMessage } from "../../utils/handleI18n";
import Section from "../atoms/section/Section";
import H3Title from "../atoms/h/H3Title";
import CheckboxItem from "../molecules/CheckboxItem";
import NumberboxItem from "../molecules/NumberboxItem";

const CacheSettings = ({ settings, dispatch }) => {
    const handleOnChangeOfIsCacheEnabled = (e) => {
        dispatch(updateIsCacheEnabled(e.target.checked));
    };

    const handleOnChangeOfCacheExpireHours = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            dispatch(updateCacheExpireHours(value));
        }
    };

    return (
        <Section>
            <H3Title>{getMessage("cache")}</H3Title>

            <CheckboxItem
                labelChild={getMessage("isCacheEnabled")}
                supplementaryChild={getMessage(
                    "appliesOnlyOnSearchResultsPages"
                )}
                name="is-cache-enabled"
                checked={settings.isCourseDataCacheEnabled}
                onChange={handleOnChangeOfIsCacheEnabled}
            />

            <NumberboxItem
                labelChild={getMessage("cacheExpireHours")}
                unit={getMessage("hour")}
                name="cache-expire-hours"
                value={settings.cacheExpireHours}
                width="40px"
                onChange={handleOnChangeOfCacheExpireHours}
            />
        </Section>
    );
};

export default CacheSettings;
