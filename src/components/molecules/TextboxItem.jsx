import React from "react";

import Item from "../atoms/Item";
import UlList from "../atoms/list/UlList";
import Label from "../atoms/label/Label";
import Textbox from "../atoms/input/Textbox";
import Supplement from "../atoms/Supplement";

const TextboxItem = (props) => {
    const { name, value, disabled = false, onChange } = props;
    const { labelChild, supplementaryChild } = props;
    const itemName = "item__" + name;

    return (
        <Item itemName={itemName}>
            <UlList
                items={[
                    <>
                        <Label htmlFor={name}>{labelChild}</Label>
                        <Textbox
                            name={name}
                            id={name}
                            value={value}
                            disabled={disabled}
                            onChange={onChange}
                        />
                        {supplementaryChild && (
                            <Supplement marginLeft="0">
                                {supplementaryChild}
                            </Supplement>
                        )}
                    </>,
                ]}
            />
        </Item>
    );
};

export default TextboxItem;
