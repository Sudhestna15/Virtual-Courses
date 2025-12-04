import React, { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice.js";

const getCreatorCourses = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const creatorCourses = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/course/getcreator",
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                dispatch(setCreatorCourseData(result.data));
                console.log(result.data);
            } catch (error) {
                console.log("Error fetching creator courses:", error);
            }
        };
        creatorCourses();
    }, [userData]);

    return null; // because this component only performs API fetching
};

export default getCreatorCourses;
