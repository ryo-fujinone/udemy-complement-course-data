import React from "react";
import { useDispatch, useSelector } from "react-redux";

import CacheSettings from "../organisms/CacheSettings";
import SettingsButtons from "../organisms/SettingsButtons";
import UfbSettings from "../organisms/UfbSettings";

const SettingsLayout = () => {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    return (
        <>
            <UfbSettings settings={settings} dispatch={dispatch} />
            <CacheSettings settings={settings} dispatch={dispatch} />
            <SettingsButtons dispatch={dispatch} />
        </>
    );
};

export default SettingsLayout;
