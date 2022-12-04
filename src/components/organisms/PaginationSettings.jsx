import React from "react";

import { updateWaitingTimeForPageNumChange } from "../../store/modules/settings";
import { getMessage } from "../../utils/handleI18n";
import Section from "../atoms/section/Section";
import H3Title from "../atoms/h/H3Title";
import NumberboxItem from "../molecules/NumberboxItem";

const PaginationSettings = ({ settings, dispatch }) => {
    const handleOnChangeWaitingTimeForPageNumChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            dispatch(updateWaitingTimeForPageNumChange(value));
        }
    };

    return (
        <Section>
            <H3Title>{getMessage("pagination")}</H3Title>

            <NumberboxItem
                labelChild={getMessage("WaitingTimeForPageNumChange")}
                unit={getMessage("millisecond")}
                name="waiting-time-for-page-num-change"
                value={settings.waitingTimeForPageNumChange}
                width="60px"
                onChange={handleOnChangeWaitingTimeForPageNumChange}
            />
        </Section>
    );
};

export default PaginationSettings;
