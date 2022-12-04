import React from "react";
import styled from "styled-components";

import Item from "../atoms/Item";
import Label from "../atoms/label/Label";
import UlList from "../atoms/list/UlList";
import Numberbox from "../atoms/input/Numberbox";
import Supplement from "../atoms/Supplement";

const StyledDiv = styled.div`
    display: flex;
    input {
        margin-right: 0.3rem;
    }
`;

const NumberboxItem = (props) => {
    const { name, value, width, onChange } = props;
    const { labelChild, supplementaryChild, unit } = props;
    const itemName = "item__" + name;

    return (
        <Item itemName={itemName}>
            <UlList
                items={[
                    <>
                        <Label htmlFor={name}>{labelChild}</Label>
                        <StyledDiv>
                            <Numberbox
                                name={name}
                                id={name}
                                value={value}
                                width={width}
                                onChange={onChange}
                            />
                            <span className="unit">{unit}</span>
                        </StyledDiv>
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

export default NumberboxItem;
