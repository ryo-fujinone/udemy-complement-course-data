import React from "react";

import { updateIsUfbEnabled, updateUfbUrl } from "../../store/modules/settings";
import { getMessage } from "../../utils/handleI18n";
import H3Title from "../atoms/h/H3Title";
import Section from "../atoms/section/Section";
import CheckboxItem from "../molecules/CheckboxItem";
import TextboxItem from "../molecules/TextboxItem";

const UfbSettings = ({ settings, dispatch }) => {
    const handleOnChangeOfIsUfbEnabled = (e) => {
        dispatch(updateIsUfbEnabled(e.target.checked));
    };

    const handleOnChangeOfUfbUrl = (e) => {
        dispatch(updateUfbUrl(e.target.value));
    };

    return (
        <Section>
            <H3Title>Udemy Business</H3Title>

            <CheckboxItem
                labelChild={getMessage("isUfbEnabled")}
                supplementaryChild={getMessage("appliesOnlyOnWww")}
                name="is-ufb-enabled"
                checked={settings.isUfbRelatedFeaturesEnabled}
                onChange={handleOnChangeOfIsUfbEnabled}
            />

            <TextboxItem
                labelChild={`Udemy Business URL (%cid=${getMessage(
                    "courseId"
                )})`}
                name="ufb-url"
                value={settings.ufbUrl}
                disabled={!settings.isUfbRelatedFeaturesEnabled}
                onChange={handleOnChangeOfUfbUrl}
            />
        </Section>
    );
};

export default UfbSettings;
