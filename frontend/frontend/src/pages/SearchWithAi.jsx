import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import ai from '../assets/ai.png'
import { RiMicAiFill } from "react-icons/ri"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import start from '../assets/start.mp3'

function SearchWithAi() {

    const startSound = new Audio(start)
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const [recommendation, setRecommendation] = useState({})
    const [listening, setListening] = useState(false)

    function speak(message) {
        let utterance = new SpeechSynthesisUtterance(message)
        window.speechSynthesis.speak(utterance)
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    if (!recognition) {
        toast.error("Speech Recognition not supported")
    }

    const handleSearch = async () => {
        setListening(true)
        if (!recognition) return;
        recognition.start()
        startSound.play()
        recognition.onresult = async (e) => {
            const transcript = e.results[0][0].transcript.trim()
            setInput(transcript)
            await handleRecommendation(transcript)
        }
    }

 const handleRecommendation = async (query) => {
  if (!query || query.trim() === "") {
    alert("Please say or type something to search");
    return;
  }

  try {
    const result = await axios.post(
      `${serverUrl}/api/course/search`,
      { input: query },
      { withCredentials: true }
    );

    setRecommendation(result.data);
    setListening(false);

    if (result.data.length > 0) {
      speak("These are the top courses I found for you");
    } else {
      speak("No courses found");
    }
  } catch (error) {
    console.log(error);
  }
};

    return (
        <div className='min-h-screen bg-gradient-to-br from-black to-gray-900 text-white
    flex flex-col items-center px-4 py-16'>
            {/* search container */}
            <div className='bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative'>
                <FaArrowLeftLong className='text-[black] w-[22px] h-[22px] cursor-pointer absolute' onClick={()=>navigate("/")} />
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2'>
                    <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="" />
                    Search with <span className='text-[#CB99C7]'> AI</span>
                </h1>

                <div className='flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full'>
                    <input type="text" className='flex-grow px-4 py-3 bg-transparent text-white ' placeholder='what do you want to learn? (e.g. AI,MERN,Cloud...)'
                        onChange={(e) => setInput(e.target.value)} value={input} />
                    {input && <button className='absolute right-14 sm:right-16 bg-white rounded-full' onClick={() => handleRecommendation(input)}>
                        <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="" />
                    </button>}
                    <button className='absolute right-2  w-10 h-10 flex items-center justify-center  bg-white rounded-full'
                        onClick={handleSearch}>
                        <RiMicAiFill className='w-5 h-5 text-[#cb87c5]' />
                    </button>
                </div>
            </div>
            {
                recommendation.length > 0 ? (
                    <div className='w-full max-w-6xl mt-12 px-2 sm:px-4'>
                        <h1 className='text-xl sm:text-2xl font-semibold mb-6 text-white text-center'>AI Search Results</h1>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-8'>
                            {
                                recommendation?.map((Course,index)=>(
                            <div key={index} className='bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200' 
                            onClick={()=>navigate(`/viewcourses/${Course._id}`)} >
                                <h2 className='text-lg font-bold sm:text-xl'>{Course.title}</h2>
                                <p className='text-sm text-gray-600 mt-1'>{Course.category}</p>

                            </div>
                            ))
}
                        </div>
                    </div>
                ) : (listening ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening ...</h1>
                    : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No Courses Found Yet</h1>

                )
            }
        </div>
    )
}

export default SearchWithAi