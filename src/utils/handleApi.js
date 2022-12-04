import axios from "axios";

const apiUrl = "https://www.udemy.com/api-2.0/";
const courseTargetKeys = [
    "created",
    "last_update_date",
    "is_in_any_ufb_content_collection",
    "published_title",
];
const taughtCourseTargetKeys = [
    ...courseTargetKeys,
    "title",
    "visible_instructors",
    "rating",
    "num_reviews",
    "content_info",
    "num_published_lectures",
    "instructional_level_simple",
    "image_240x135",
];

const fetchData = async (url) => {
    const data = await axios
        .get(url)
        .then((res) => res.data)
        .catch((e) => {
            console.log(e);
            return {};
        });
    return data;
};

export { apiUrl, courseTargetKeys, taughtCourseTargetKeys, fetchData };
