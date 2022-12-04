import React from "react";
import styled from "styled-components";

const StyledH2 = styled.h2`
    margin-top: 0;
`;

const H2Title = ({ className, children }) => {
    return <StyledH2 className={className}>{children}</StyledH2>;
};

export default H2Title;
