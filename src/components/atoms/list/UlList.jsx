import React from "react";
import styled from "styled-components";

const StyledUl = styled.ul`
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 20px;
`;

const UlList = ({ items = [] }) => {
    return (
        <StyledUl>
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </StyledUl>
    );
};

export default UlList;
