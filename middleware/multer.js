const multer = require("multer"); // Multer is a nodejs middleware used for uploading files.
const path = require('path');
const storage = multer.diskStorage({
    // defines where files should be stored
    destination: function (req, file, callback) {
        callback(null, "./public/uploads");
    },

    // add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

// upload parameters for multer
const upload = multer({
    storage: storage,
    // limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        var user = undefined;
        try {
            user = req.user.user;
        } catch (e) { }


        // Set the filetypes, it is optional 
        var filetypes = /mp4|mkv|mp3/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());
        // if (mimetype && extname) { 
        if (user && user.isAdmin) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
        // } 
        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }
    // file is the name of file attribute 
}).array("file", 10);

module.exports = { upload };
