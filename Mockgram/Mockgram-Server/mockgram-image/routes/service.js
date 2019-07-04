const express = require("express");
const multipart = require("connect-multiparty");
const cors = require("cors");
const agent = require("superagent");
const {
  deleteFileAsync,
  getFileName,
  uploadImage
} = require("../../utils/fileUpload");
const { serverNodes } = require("../../config");
const { handleError } = require("../../utils/handleError");
const response = require("../../utils/response");
const { image } = require("../../config");
const router = express.Router();

router.post("/object-detection", cors(), multipart(), async (req, res) => {
  let imageFile = req.files.image;
  let limit = image.limit;
  try {
    let fileName = await getFileName(imageFile);
    let fileLocation = `${image.tmp}${fileName}`;
    let imageQueryPath = `${image.tmpQuery}${fileName}`;
    let saveRes = await uploadImage(limit, fileLocation, imageFile);
    console.log(saveRes);
    return agent
      .get(`${serverNodes.mlServer}/object-detection?image=${imageQueryPath}`)
      .set("Accept", "application/json")
      .end(async (err, resp) => {
        if (err) throw new Error(err);
        try {
          await deleteFileAsync(fileLocation);
          let djangoRes = JSON.parse(resp.text);
          if (djangoRes.status !== 200) {
            return res.json({
              status: response.ERROR.SERVER_ERROR.CODE,
              msg: response.ERROR.SERVER_ERROR.MSG
            });
          }
          return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: djangoRes.data
          });
        } catch (err) {
          throw new Error(err);
        }
      });
  } catch (err) {
    return handleError(res, err);
  }
});
module.exports = router;
