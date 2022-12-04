import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
    span {
        margin-left: 20px;
    }
`;

const Label = ({ className, htmlFor, children }) => {
    return (
        <StyledLabel className={className} htmlFor={htmlFor}>
            {children}
        </StyledLabel>
    );
};

export default Label;
