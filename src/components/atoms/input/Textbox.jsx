import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    width: 90%;
`;

const Textbox = ({ name, value, disabled, onChange }) => {
    return (
        <StyledInput
            type="text"
            name={name}
            id={name}
            value={value}
            disabled={disabled}
            onChange={onChange}
        />
    );
};

export default Textbox;
