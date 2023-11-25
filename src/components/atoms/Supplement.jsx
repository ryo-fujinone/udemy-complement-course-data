import React from "react";
import styled from "styled-components";

const StyledSpan = styled.span`
    display: block;
    margin-left: ${(props) => props.$marginLeft || 0};
`;

const Supplement = ({ children, marginLeft = "20px" }) => {
    return (
        <StyledSpan className="supplement" $marginLeft={marginLeft}>
            {children}
        </StyledSpan>
    );
};

export default Supplement;
