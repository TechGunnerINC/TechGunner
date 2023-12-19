import { v2 as cloud } from "cloudinary";

cloud.config({
    cloud_name: process.env.CLOUD_N,
    api_key: process.env.CLOUD_K,
    api_secret: process.env.CLOUD_S
})

export default cloud