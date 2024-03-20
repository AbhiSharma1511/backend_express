import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import APiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";



// method for token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user)
      throw new ApiError(
        500,
        "In generateAccessAndRefreshToken: user does not find"
      );

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    console.log("Access Token: ",accessToken);
    console.log("Refresh Token: ",refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists - email/username
  // check for images - avatar
  // upload them to cloudinary - avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, username, email, password } = req.body;
  console.log("Body: ", req.body);

  // if(fullName===""){
  //     throw new ApiError(400,"FullName is required")
  // }
  if (
    [fullName, email, username, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All feilds are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    // console.log(existedUser.fullName);
    // console.log(existedUser.email);
    // console.log(existedUser.username);
    throw new ApiError(409, "User with email or username already exixt");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log(req.files);

  //   console.log(avatarLocalPath);
  //   console.log(coverImageLocalPath);

  if (avatarLocalPath == "") {
    throw new ApiError(400, "Avatar file path is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //   console.log(avatar)
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while creating new user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body - data
  // get the user details like - email/username + password
  // find the user
  // check password
  // access and refresh token generate and send to user
  // send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new APiError(400, "Username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(404, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, { user }, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res)=>{
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request")

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user) throw new ApiError(401, "Invalid refresh token")

    if(incomingRefreshToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh token is expired or used")
    
    const option = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res.status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", newRefreshToken, option)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, error?.messae)
  }

  

})


export { registerUser, loginUser, logoutUser, refreshAccessToken };
