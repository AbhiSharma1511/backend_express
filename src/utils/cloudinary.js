import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        // uload the file to the cloud
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded on cloudinary successfully
        console.log("file has been uploaded on cloudinary successfully", responce.url);
        return responce

    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
    }
}

export default uploadOnCloudinary





// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });