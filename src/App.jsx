import React from "react";
import { useDispatch } from "react-redux";
import { useLayoutEffect } from "react";

import "./App.css";
import { getFromStorage } from "./utils/handleStorage";
import { updateSettings } from "./store/modules/settings";
import Settings from "./components/pages/Settings";

const App = () => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        (async () => {
            const result = await getFromStorage(["settings"]);
            const settings = result.settings ?? {};
            dispatch(
                updateSettings({
                    settings,
                    mes: "restore",
                })
            );
        })();
    }, []);

    return (
        <div className="App">
            <Settings />
        </div>
    );
};

export default App;
