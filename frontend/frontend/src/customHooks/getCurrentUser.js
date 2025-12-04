import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const getCurrentUser = () => {
    const dispatch=useDispatch()
 useEffect(()=>{
    const fetchUser=async()=>{
        try {
            const result=await axios.get(serverUrl + "/api/user/getCurrentUser",
                {withCredentials:true})
dispatch(setUerData(result.data))
        } catch (error) {
            console.log(error)
            dispatch(setUerData(null))

        }
    }
 })

}
export default getCurrentUser