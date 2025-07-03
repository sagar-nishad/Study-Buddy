"use client"
import React from 'react'
import { UserAuth } from '../context/AuthContext'
import axios from 'axios';
import { BaseNextRequest } from 'next/dist/server/base-http';
import { basePath } from '../config';

function testing() {
  const { user } = UserAuth();


  // ! for Creating a user 
  

  // ! Creating A post
  const createPost = async (title, hashtags, summary = null, pdfLink = null, images = null) => {
    const post = {
      id: Date.now().toString() + user.email,
      title,
      hashtags,
      date: new Date().toISOString(),
      pdfUrl: "https://ik.imagekit.io/sagarni101/resume_fdVkB7aYP.pdf",
      imageUrls: ["https://ik.imagekit.io/sagarni101/sign_x0LGrGskx.jpg"],
      userID: user.email,
      summary: null
    };
    console.log(post)
    axios.post(basePath + "/api/createPost", post)
      .then(res => {
        console.log("res", res)
      })
      .catch(err => {
        console.log("errr", err)
      })
  }


  // ! Saving A post 

  const savePost = async (userID, postID) => {
    const params = {
      "userID": userID,
      "postID": postID
    }
    axios.post("http://localhost:5000/api/savePost", params)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }


  // ! getting all post created / saved by user 
  const get_user_post = async (type) => {

    axios.get('http://localhost:5000/api/get_created_post', {
      params: { userID: 'data.mining.project.iitg@gmail.com', type: type }
    })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));


  }

  // ! Deleting a post 

  const delete_a_post = async (id) => {
    axios.post("ttp://localhost:5000/api/get_created_post"  , {id : "THmyyMNJwyHDRyR2O37I"})
    .then( res =>{
      console.log(res)

    }).catch(err => {
      console.log(errr)
    })

  }


  const handleClick = () => {
    console.log("pressed  me ");
    console.log(user.email, user.displayName)
    // ! for creating a USER
    // createUser(user.displayName , user.email)
    createPost("GANs", "#genAI");
    // get_user_post("created")
    // get_user_post("saved")
    // savePost("data.mining.project.iitg@gmail.com" , "THmyyMNJwyHDRyR2O37I")
    // delete_a_post();

  }
  return (
    <div className='flex flex-col border-amber-50 p-4'>
      <p>The Button </p>
      <button className='border-red-300 cursor-pointer' onClick={handleClick}>Press Me</button>
    </div>
  )
}

export default testing