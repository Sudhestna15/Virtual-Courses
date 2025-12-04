import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'

function CardPage() {
  const { courseData, creatorCourseData } = useSelector(state => state.course)
  const [popularCourses, setPopularCourses] = useState([])

  useEffect(() => {
    // If user is educator, show their courses
    // If user is student, show published courses
    const userType = localStorage.getItem("role") // or however you store role (e.g., "student" / "educator")

    if (userType === "educator") {
      setPopularCourses(creatorCourseData?.slice(0, 6))
      console.log("Educator Courses:", creatorCourseData)
    } else {
      setPopularCourses(courseData?.slice(0, 6))
      console.log("Published Courses for Students:", courseData)
    }
  }, [courseData, creatorCourseData])

  return (
    <div className='relative flex items-center justify-center flex-col'>
      <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>
        Our Popular Courses
      </h1>
      <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>
        Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities.
      </span>
      <div className='w-[100%] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]'>
        {
          popularCourses?.map((course, index) => (
            <Card key={index}
              thumbnail={course.thumbnail}
              title={course.title}
              category={course.category}
              price={course.price}
              id={course._id}
              reviews={course.reviews}
            />
          ))
        }
      </div>
    </div>
  )
}

export default CardPage
