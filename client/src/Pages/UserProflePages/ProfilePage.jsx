import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { setUser } from '../../app/features/getUser';

function ProfilePage() {
    const [userId,setUserId]=useState(0)
    const params=useParams();
    useEffect(()=>{
        setUserId(params.id)
    },[])

  return <>
  
    <div className="haeder">
        

    </div>


  </>
}

export default ProfilePage