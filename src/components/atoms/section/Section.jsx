import React from "react";
import styled from "styled-components";

const StyledSection = styled.section`
    border-bottom: 1px solid #aaa;
    margin-bottom: 1rem;
`;

const Section = ({ children }) => {
    return <StyledSection>{children}</StyledSection>;
};

export default Section;
