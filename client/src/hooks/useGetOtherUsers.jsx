import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';


const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user`);
                // store
                console.log("other users -> ",res);
                console.log("Res.data.data from useGetOtherUsers.jsx :: ", res.data.data)
                dispatch(setOtherUsers(res.data.data));
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
    }, [])

}

export default useGetOtherUsers