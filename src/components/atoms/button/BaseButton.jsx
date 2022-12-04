import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 4px 8px;
    border-radius: 5px;
    border: none;
    background-color: #ddd;
    :hover {
        opacity: 0.8;
    }
    :active {
        background-color: #aaa;
    }
`;

const BaseButton = ({ children, onClick }) => {
    return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default BaseButton;
