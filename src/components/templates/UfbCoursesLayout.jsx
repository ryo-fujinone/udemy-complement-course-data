import React from "react";
import { useSelector } from "react-redux";

import H2Title from "../atoms/h/H2Title";
import UfbCourseCards from "../organisms/UfbCourseCards";

const UfbCoursesLayout = () => {
    const ufbCourses = useSelector((state) => state.ufbCourses);

    return (
        <>
            <H2Title className="ud-heading-lg">
                Udemy Business courses - ({ufbCourses.length})
            </H2Title>
            <UfbCourseCards ufbCourses={ufbCourses} />
        </>
    );
};

export default UfbCoursesLayout;
