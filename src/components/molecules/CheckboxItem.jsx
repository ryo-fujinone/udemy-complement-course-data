import React from "react";
import styled from "styled-components";

import Item from "../atoms/Item";
import Checkbox from "../atoms/input/Checkbox";
import Label from "../atoms/label/Label";
import Supplement from "../atoms/Supplement";

const StyledItem = styled(Item)`
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: left;
`;

const StyledLabel = styled(Label)`
    width: 90%;
`;

const CheckboxItem = (props) => {
    const { name, checked = true, disabled = false, onChange } = props;
    const { labelChild, supplementaryChild } = props;
    const itemName = "item__" + name;

    return (
        <StyledItem itemName={itemName}>
            <Checkbox
                name={name}
                id={name}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
            <StyledLabel htmlFor={name}>{labelChild}</StyledLabel>
            {supplementaryChild && (
                <Supplement>{supplementaryChild}</Supplement>
            )}
        </StyledItem>
    );
};

export default CheckboxItem;
