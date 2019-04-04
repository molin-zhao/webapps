const express = require("express");
const multipart = require("connect-multiparty");
const cors = require("cors");
const agent = require("superagent");
const {
  deteleFileAsync,
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
  let dest = image.tmp;
  let limit = image.limit;
  const result = await getFileName(dest, imageFile);
  if (result.err) {
    return handleError(res, result.err);
  }
  let fileName = result.fileName;
  let fileLocation = result.fileLocation;
  let imageQueryPath = `${image.tmpQuery}${fileName}`;
  uploadImage(limit, fileLocation, imageFile, err => {
    if (err) return handleError(res, err);
    return agent
      .get(`${serverNodes.mlServer}/object-detection?image=${imageQueryPath}`)
      .set("Accept", "application/json")
      .end(async (err, resp) => {
        if (err) return handleError(res, err);
        await deteleFileAsync(fileLocation);
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
      });
  });
});
module.exports = router;
