import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

function MyEnrolledCourses() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
   const fetchCourses = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User does not have token");

        let res;
        if (userData?.role === "student") {
            res = await axios.get(`${serverUrl}/api/course/getEnrolledCourses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            res = await axios.get(`${serverUrl}/api/course/getcreator`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        setCourses(res.data);
    } catch (error) {
        console.log("Error fetching courses:", error.response?.data || error.message);
    }
};


    if (userData) {
        fetchCourses();
    }
}, [userData]);


    return (
        <div className='min-h-screen w-full px-4 py-9 bg-gray-50'>
            <FaArrowLeftLong
                className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer'
                onClick={() => navigate('/')}
            />
           
            <h1 className='text-3xl text-center font-bold text-gray-800 mb-6'>
                {userData?.role === "student" ? "My Enrolled Courses" : "My Created Courses"}
            </h1>

            {courses.length === 0 ? (
                <p className='text-gray-500 text-center w-full'>
                    {userData?.role === "student"
                        ? "You haven't enrolled in any course yet"
                        : "You haven't created any course yet"}
                </p>
            ) : (
                <div className='flex items-center justify-center flex-wrap gap-[30px]'>
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-2xl shadow-md overflow-hidden border cursor-pointer hover:scale-[1.02] transition'
                            onClick={() => navigate(`/viewcourse/${course._id}`)}
                        >
                            <img
                                src={course.thumbnail}
                                className='w-[300px] h-40 object-cover'
                                alt={course.title}
                            />
                            <div className='p-3'>
                                <h2 className='font-semibold text-lg'>{course.title}</h2>
                                <p className='text-sm text-gray-500'>{course.category}</p>
                                <h1
                                    className='px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px]
                                    text-[15px] font-light cursor-pointer mt-[10px] hover:bg-gray-600'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/viewlecture/${course._id}`);
                                    }}>
                                    Watch Now
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyEnrolledCourses;
