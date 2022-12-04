import React from "react";
import styled from "styled-components";
import moment from "moment/moment";

import H3Title from "../atoms/h/H3Title";
import ReactStarsRating from "react-awesome-stars-rating";
import { generateUfbCourseUrl } from "../../utils/generateUrl";
import { getMessage } from "../../utils/handleI18n";

const StyledContainer = styled.div`
    width: 290px;
`;

const StyledA = styled.a`
    color: black;
    :visited {
        color: black;
    }
    :hover {
        color: black;
    }
`;

const StyledImgWrapper = styled.div`
    img {
        border: 1px solid #ddd;
    }
`;

const StyledH3Title = styled(H3Title)`
    font-weight: bold;
    margin-top: 8px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
`;

const StyledCardRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
`;

const StyledRatingNumber = styled.span`
    color: #b4690e;
`;

const StyledMetaInfoRow = styled(StyledCardRow)`
    gap: 0;
    span:not(:first-child)::before {
        content: "\\25CF";
        margin: 0 0.4rem;
        font-size: 6px;
    }
`;

const StyledMetaInfo = styled.span`
    font-size: 12px;
    color: #6a6f73;
`;

const CourseCard = ({ course, settings }) => {
    if (course === undefined) return <></>;

    const ufbCourseUrl = generateUfbCourseUrl(
        settings.ufbUrl,
        course.published_title
    );
    const rating = Math.round(course.rating * 10) / 10;

    return (
        <StyledContainer>
            <StyledA href={ufbCourseUrl}>
                <StyledImgWrapper>
                    <img alt="course" width="290" src={course.image_240x135} />
                </StyledImgWrapper>

                <div>
                    <StyledH3Title>{course.title}</StyledH3Title>

                    <div>
                        {typeof course.visible_instructors === "object" && (
                            <StyledMetaInfo>
                                {course.visible_instructors
                                    .map((instructor) => instructor.title)
                                    .join(", ")}
                            </StyledMetaInfo>
                        )}
                    </div>

                    <StyledCardRow>
                        <StyledRatingNumber className="ud-heading-sm">
                            {rating}
                        </StyledRatingNumber>
                        <ReactStarsRating
                            value={rating}
                            size={14}
                            isEdit={false}
                        />
                        <StyledMetaInfo>({course.num_reviews})</StyledMetaInfo>
                    </StyledCardRow>

                    <StyledMetaInfoRow>
                        <StyledMetaInfo>{course.content_info}</StyledMetaInfo>
                        <StyledMetaInfo>
                            {getMessage("numLectures")}:{" "}
                            {course.num_published_lectures}
                        </StyledMetaInfo>
                        <StyledMetaInfo>
                            {course.instructional_level_simple}
                        </StyledMetaInfo>
                    </StyledMetaInfoRow>

                    {moment(course.created).isValid() &&
                        moment(course.last_update_date).isValid() && (
                            <StyledMetaInfoRow>
                                <StyledMetaInfo>
                                    {getMessage("createdDate")}:{" "}
                                    {new Date(
                                        course.created
                                    ).toLocaleDateString()}
                                </StyledMetaInfo>
                                <StyledMetaInfo>
                                    {getMessage("lastUpdateDate")}:{" "}
                                    {new Date(
                                        course.last_update_date
                                    ).toLocaleDateString()}
                                </StyledMetaInfo>
                            </StyledMetaInfoRow>
                        )}
                </div>
            </StyledA>
        </StyledContainer>
    );
};

export default CourseCard;
