import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
    margin-bottom: 0.7rem;
`;

const Item = ({ className, itemName, children }) => {
    return (
        <StyledDiv className={`item ${className}`} id={itemName}>
            {children}
        </StyledDiv>
    );
};

export default Item;
