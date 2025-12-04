import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong, FaLock, FaStar } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setSelectedCourse } from '../redux/courseSlice.js'
import img from "../assets/empty.jpg"
import axios from 'axios'
import { serverUrl } from '../App'
import { FaPlayCircle } from 'react-icons/fa'
import Card from '../component/Card'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'


function ViewCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { courseData } = useSelector(state => state.course)
  const { selectedCourse } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [courseDetails, setCourseDetails] = useState(null)
  const [creatorData, setCreatorData] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [creatorCourses, setCreatorCourses] = useState(null)
  const [allCourses, setAllCourses] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const dispatch = useDispatch()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      })
      setCourseDetails(result.data)
      dispatch(setSelectedCourse(result.data))
      console.log("Fetched course:", result.data)
    } catch (error) {
      console.log("Error fetching course:", error)
    }
  }

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getallcourses`, { withCredentials: true })
      setAllCourses(res.data || [])
    } catch (err) {
      console.log("Error fetching all courses:", err)
    }
  }

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(`${serverUrl}/api/order/razorpay-order`, { userId, courseId }, { withCredentials: true })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: 'INR',
        name: "TRAINIX COURSES",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(`${serverUrl}/api/order/verifypayment`, { ...response, courseId, userId }, { withCredentials: true })

            toast.success(verifyPayment.data.message)
            setIsEnrolled(true)

            dispatch({
              type: "user/updateEnrolledCourses",
              payload: courseId
            })

          } catch (error) {
            toast.error(error?.response?.data?.message || "Payment verification failed")
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.log(error)
      toast.error("Failed to start payment")
    }
  }



  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(serverUrl + "/api/course/creator",
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          )
          console.log(result.data)
          setCreatorData(result.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    handleCreator()
  }, [selectedCourse])

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c =>
      (typeof c === 'string' ? c : c._id).toString() === courseId?.toString())
    if (verify) {
      setIsEnrolled(true)
    }
  }

  useEffect(() => {
    if (creatorData?._id && allCourses.length > 0) {
      const filtered = allCourses.filter(c => c.creator === creatorData._id && c._id !== courseId)
      setCreatorCourses(filtered)
    }
  }, [creatorData, allCourses, courseId])


  const handleReview = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true })
      setLoading(false)
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
      setRating(0)
      setComment("")
    }
  }

  const calculateAvgReview=(reviews)=>{
    if(!reviews || reviews.length === 0){
      return 0
    }
    const total=reviews.reduce((sum,review)=>sum + review.rating , 0)
    return (total/reviews.length).toFixed(1)
  }
  const avgRating=calculateAvgReview(selectedCourse?.reviews)
  console.log("Avg Rating :" ,avgRating)

  useEffect(() => {
    setIsEnrolled(false)

    const checkEnrollment = () => {
      const verify = userData?.enrolledCourses?.some(c =>
        (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
      )
      if (verify) {
        setIsEnrolled(true)
      }
    }

    checkEnrollment()
  }, [courseId, userData])



  useEffect(() => {
    fetchCourseById()
    checkEnrollment()
  }, [courseId, userData])

  useEffect(() => {
    fetchAllCourses()
  }, [])


  useEffect(() => {
    console.log("Selected Course:", selectedCourse);

  }, [selectedCourse]);
  useEffect(() => {
    console.log("All courses in Redux:", courseData);
  }, [courseData]);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative'>
        {/*top section */}
        <div className='flex flex-col md:flex-row gap-6'>
          {/*thumbnail */}
          <div className='w-full md:w-1/2'>
            <FaArrowLeftLong className='text-[black] w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")} />
            {selectedCourse?.thumbnail ? <img src={selectedCourse?.thumbnail} className='rounded-xl w-full object-cover' /> :
              <img src={img} alt="" className='rounded-xl w-full object-cover' />
            }
          </div>
          {/*Course Info */}
          <div className='flex-1 space-y-2 mt-[20px]'>
            <h2 className='text=2xl font-bold'>
              {selectedCourse?.title}
            </h2>
            <p className='text-gray-600 '>
              {selectedCourse?.subTitle}
            </p>
            <div className='flex items-start flex-col justify-between'>
              <div className='text-yellow-500 font-medium flex gap-2'>
                <span className='flex items-center justify-start gap-1'><FaStar />{avgRating}</span>
                <span className='text-gray-400'>(1,200 Reviews)</span>
              </div>
              <div className=''>
                <span className='text-xl font-semibold text-black'>₹{selectedCourse?.price}</span>
                {" "}
                <span className='line-through text-sm text-gray-400'>599</span>
              </div>

              <ul className='text-sm text-gray-700 space-y-1 pt-2'>
                <li>✅ 10+ hours of video content</li>
                <li>✅ Lifetime access to course materials</li>
              </ul>
              {!isEnrolled ?
                <button
                  className='bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer'
                  onClick={() => handleEnroll(userData._id, courseId)}>
                  Enroll Now
                </button> :
                <button
                  className='bg-green-100 text-green-500 px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer'
                  onClick={() => navigate(`/viewlecture/${courseId}`)}>
                  Watch Now
                </button>
              }


            </div>
          </div>
        </div>
        <div>
          <h2 className='tex-xl font-semibold mb-2'>What You'll Learn</h2>
          <ul className='list-disc pl-6 text-gray-700 space-y-1 '>
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>
        <div>
          <h2 className='text-xl font-semibold mb-2'>Who This Course is For</h2>
          <p className='text-gray-700'>Beginners,aspiring developers,and professionals looking to upgrade skills.</p>
        </div>
        <div className='flex flex-col md:flex-row gap-6 '>
          <div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200 '>
            <h2 className='text-xl font-bold mb-1 text-gray-800'>Course Curriculum</h2>
            <p className='tex-sm text-gray-500 mb-4'>
              {selectedCourse?.lecture?.length} Lectures
            </p>
            <div className='flex flex-col gap-3'>
              {selectedCourse?.lecture?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) setSelectedLecture(lecture);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left
        ${lecture.isPreviewFree ? "hover:bg-gray-100 cursor-pointer border-gray-300" :
                      "cursor-not-allowed opacity-60 border-gray-200"}
        ${selectedLecture?.lectureTitle === lecture?.lectureTitle ? "bg-gray-100 border-gray-400" : ""}`}>
                  <span className='text-lg text-gray-700'>{lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}</span>
                  <span className='text-sm font-medium text-gray-800'>  {lecture?.lectureTitle}</span>

                </button>
              ))}
            </div>
          </div>
          <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border order-gray-200'>
            <div className='aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center'>
              {selectedLecture?.videoUrl ? <video className='w-full h-full object-cover' src={selectedLecture?.videoUrl} controls /> :
                <span className='text-white text-sm'> select a preview lecture to watch</span>
              }
            </div>
          </div>
        </div>

        <div className='mt-8 border-t pt-6'>
          <h2 className='text-xl font-semibold mb-2'>
            Write Reviews
          </h2>
          <div className='mb-4'>
            <div className='flex gap-1 mb-2'>
              {
                [1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} onClick={() => setRating(star)} className={star <= rating ? "fill-amber-300" : "fill-gray-300"} />
                ))
              }
            </div>
            <textarea onChange={(e) => setComment(e.target.value)} value={comment} name="" className='w-full border border-gray-300 rounded-lg p-2 ' placeholder='write your review here...' rows={3}></textarea>

            <button className='bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800' disabled={loading} onClick={handleReview}>
              {loading ? <ClipLoader size={30} color='white' /> : "Submit Review"}
            </button>
          </div>
        </div>

        {/* for creator Info */}

        <div className='flex items-center gap-4 pt-4 border-t'>
          {creatorData?.photoUrl ? <img src={creatorData?.photoUrl} className=' border-1 border-gray-200 w-16 h-16 rounded-full object-cover' /> :
            <img src={img} className='border-1 border-gray-100 w-16 h-16 rounded-full object-cover' />}

          <div>
            <h2 className='text-lg font-semibold'>{creatorData?.name}</h2>
            <p className='md:text-sm text-graay-600 text-[10px]'>{creatorData?.description}</p>
            <p className='md:text-sm text-graay-600 text-[10px]'>{creatorData?.email}</p>
          </div>
        </div>

        <div>

          <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator</p>

        </div>

        <div className='w-full transition-all duration-300 py-[20px] flex items-start justify-center
lg:justify-start flex-wrap gap-6 lg:px-[80px]'>
          {
            creatorCourses?.map((course) => (
              <Card key={course._id} thumbnail={course.thumbnail} id={course._id}
                price={course.price} title={course.title} category={course.category} />
            ))
          }

        </div>
      </div>
    </div>
  )
}

export default ViewCourse


