import React from "react";
import styled from "styled-components";

import { updateSettings } from "../../store/modules/settings";
import { deleteCache } from "../../utils/handleCache";
import { getMessage } from "../../utils/handleI18n";
import getDefaultSettings from "../../utils/defaultSettings";
import Section from "../atoms/section/Section";
import BaseButton from "../atoms/button/BaseButton";
import Item from "../atoms/Item";

const StyledItem = styled(Item)`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1rem;
`;

const SettingsButtons = ({ dispatch }) => {
    const handleOnClickOfReset = () => {
        dispatch(updateSettings({ settings: getDefaultSettings() }));
    };

    const handleOnClickOfDeleteCache = async () => {
        await deleteCache();
    };

    return (
        <Section>
            <StyledItem>
                <BaseButton onClick={handleOnClickOfReset}>
                    {getMessage("resetSettings")}
                </BaseButton>
                <BaseButton onClick={handleOnClickOfDeleteCache}>
                    {getMessage("deleteCache")}
                </BaseButton>
            </StyledItem>
        </Section>
    );
};

export default SettingsButtons;
