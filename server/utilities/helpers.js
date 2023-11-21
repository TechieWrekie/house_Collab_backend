require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { S3Client,GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require('multer')
const multerS3 = require('multer-s3')



const SECRET = "LIZASECRET"

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
  region: process.env.AWS_REGION,
})

var uploadImageFun = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      const filename = file.originalname.replace(path.extname(file.originalname), "")
      const extension = path.extname(file.originalname);
      cb(null, `${filename}${Date.now()}${extension}`)
    }
  })
})
function unlinkImage(pic) {
  if (pic != undefined && pic != "") {
    fs.unlink("server/public/" + pic, (err) => {
      // if(err) console.log(err);
      // else console.log("image Replaced");
    });
  }
}

//Pre sign the url to show the images from the aws s3 bucket to the user
async function generatePresignedUrl (bucket,key,expiresIn = 3600){
    const command = new GetObjectCommand({
      Bucket:bucket,
      Key:key,
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn });

    return signedUrl;
}

// var uploadImageFun = multer({
//     storage: imageStorageFun
// });


module.exports = {
  uploadImageFun,
  unlinkImage,
  SECRET,
  generatePresignedUrl
}