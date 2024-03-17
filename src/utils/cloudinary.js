import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import APiError from "./ApiError.js";

// cloudinary.config({
//   cloud_name:'di75qbwmu',
//   api_key:'726678248749899',
//   api_secret:'y4rbr4vRE7-GxmiqwExvQ9A3WW8'
// });

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    // console.log(process.env.CLOUDINARY_API_KEY)
    try{
        if(!localFilePath) throw new APiError(400,"Local file path is required");
        // upload the file to the cloud
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded on cloudinary successfully
        console.log("file has been uploaded on cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath) // only for testing...so delete the uploaded file from temp folder
        return response

    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
        throw new APiError(400,error.message);
    }
}

export {uploadOnCloudinary}


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });