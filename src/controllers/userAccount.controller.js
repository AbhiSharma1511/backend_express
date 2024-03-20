import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body
  
    const loggedInUserId  = req.user?._id
    const user =  await User.findById(loggedInUserId)
  
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  
    if(!isPasswordCorrect) throw new ApiError(400,"Invalid old password")
  
    user.password = newPassword
    await user.save({validateBeforeSave: false})
  
    return res
    .status(200)
    .json(new ApiResponse(200,{}, "Password changed successfully"))
  
  
  })
  
  const getCurrentUSer = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user,"Current user fetched successfully")
  })
  
  const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullName, email} = req.body
    if(!fullName && !email) throw new ApiError(400, "Both feils are required")
  
    const user = User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          fullName,
          email: email
        }
      },
      {new: true}
      ).select("-password")
      
      return res
      .status(200)
      .json(new ApiResponse(200, user, "Account deatils updated successfully"))
  
  })
  
  const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path
  
    if(!avatarLocalPath) throw new ApiError(400, "File is missing")
    const avatar = await uploadOnCloudinary(avatarLocalPath)
  
    if(!avatar.url) throw new ApiError(400, "Error while uploading avatar on cloudinary")
  
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {$set:{
        avatar : avatar.url
      }},
      {new :true}
    ).select("-password")
  
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image uploaded successfully")
    )
  })
  
  const updateUserCoverImage = asyncHandler(async(req, res)=>{
    const coverImageLocalPath = req.file?.path
  
    if(!coverImageLocalPath) throw new ApiError(400, "CoverImage File is missing")
    const cover = await uploadOnCloudinary(coverImageLocalPath)
  
    if(!cover.url) throw new ApiError(400, "Error while uploading coverImage on cloudinary")
  
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {$set:{
        coverImage : cover.url
      }},
      {new :true}
    ).select("-password")
  
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image uploaded successfully")
    )
  
  })

  export {changeCurrentPassword, getCurrentUSer, updateAccountDetails,updateUserAvatar, updateUserCoverImage}