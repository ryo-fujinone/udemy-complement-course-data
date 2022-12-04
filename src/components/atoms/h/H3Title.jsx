import React from "react";
import styled from "styled-components";

const StyledH3 = styled.h3`
    margin-top: 0;
`;

const H3Title = ({ className, children }) => {
    return <StyledH3 className={className}>{children}</StyledH3>;
};

export default H3Title;
