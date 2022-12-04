import React from "react";
import styled, { css } from "styled-components";

const StyledInput = styled.input`
    display: block;
    ${(props) =>
        props.width &&
        css`
            width: ${(props) => props.width};
        `}
`;

const Numberbox = ({ name, value = 0, onChange, width = "50px" }) => {
    return (
        <StyledInput
            type="number"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            width={width}
        />
    );
};

export default Numberbox;
