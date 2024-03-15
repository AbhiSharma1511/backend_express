// using promises for this
const asyncHandler = (requestHandler) =>{
    (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch( (err)=> next(err))
    }
}

// try catch method for this
// const asyncHandler = (fn) =>{
//     async(req, res, next) => {
//         try{
//             await fn(req, res, next)
//         }
//         catch(error){
//             res.send(err.code||500).json({
//                 success: false,
//                 message: err.message
//             })
//         }
//     }
// }

export {asyncHandler}