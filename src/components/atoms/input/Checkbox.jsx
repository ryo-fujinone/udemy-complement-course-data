import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    vertical-align: top;
`;

const Checkbox = ({ name, checked, disabled, onChange }) => {
    return (
        <StyledInput
            type="checkbox"
            name={name}
            id={name}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
        />
    );
};

export default Checkbox;
