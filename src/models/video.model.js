import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // We have a User model
        required: true
      },
      videoFile: {
        type: String, // cloudinary url
        required: true
      },
      thumbnail: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      views: {
        type: Number,
        default: 0 // Default value for views
      },
      isPublished: {
        type: Boolean,
        default: true // Default value for isPublished
      },
},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)