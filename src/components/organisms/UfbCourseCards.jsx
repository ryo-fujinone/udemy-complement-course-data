import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import CourseCard from "../molecules/CourseCard";

const StyledCardsWrapper = styled.div`
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`;

const UfbCourseCards = ({ ufbCourses }) => {
    const settings = useSelector((state) => state.settings);

    return (
        <StyledCardsWrapper>
            {ufbCourses.map((course, idx) => (
                <CourseCard course={course} settings={settings} key={idx} />
            ))}
        </StyledCardsWrapper>
    );
};

export default UfbCourseCards;
