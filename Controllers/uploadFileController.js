const attachmentModel = require("../Models/attachmentModel");
const uploadFileController = async (req, res) => {
  let file = req?.file;
  let _id = req?.body?._id;
  if (file == null || file == undefined) {
    return res?.status(400).send("File not upload");
  }
  
  if (_id == "" || _id == null || _id == undefined) {
    return res?.status(401).send("no user found");
  }
  
  new attachmentModel({
    userId: {
      _id: _id,
    },
    attachment: {
      fieldname: file?.fieldname,
      originalname: file?.originalname,
      encoding: file?.encoding,
      mimetype: file?.mimetype,
      destination: file?.destination,
      filename: file?.filename,
      path: file?.path,
      size: file?.size,
    },
  }).save();
  res?.send("hello")
};

module.exports = uploadFileController;
