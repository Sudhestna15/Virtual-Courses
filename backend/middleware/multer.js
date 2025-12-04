
import multer from "multer"
import path from "path"

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "./public")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload