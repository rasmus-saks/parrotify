var express = require('express');
var router = express.Router();

var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var Image = Canvas.Image;
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'temp/'});

var offsets = [
  [21, 14],
  [17, 12],
  [14, 12],
  [12, 13],
  [11, 13],
  [13, 15],
  [17, 18],
  [20, 18],
  [23, 16],
  [23, 14]
];

var parrot = 1;

router.post("/parrotify.gif", upload.single('file'), function (req, res) {
  var encoder = new GIFEncoder(30, 30);
  var facepath = req.file.path;
  var face = new Image;
  var facedata = fs.readFileSync(facepath);
  var faceOffsetX = +req.body.offsetX;
  var faceOffsetY = +req.body.offsetY;
  var faceScale = +req.body.scaleP + 23;
  var delay = 40 + (+req.body.delay);
  face.src = facedata;
  res.setHeader('Content-disposition', 'attachment; filename=parrotify.gif');
  encoder.createReadStream().pipe(res);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(delay);
  var canvas = new Canvas(30, 30);
  var ctx = canvas.getContext('2d');
  for (var i = 0; i < 10; i++) {
    var path = "./parrots/"+ parrot + "/" + i + ".png";
    var file = fs.readFileSync(path);
    var img = new Image;
    img.src = file;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 30, 30);
    ctx.drawImage(img, 0, 0, 30, 30);
    ctx.drawImage(face, offsets[i][0] - 15 + faceOffsetX, offsets[i][1] - 15 + faceOffsetY, faceScale, faceScale);
    encoder.addFrame(ctx);
  }
  encoder.finish();
  fs.unlinkSync(facepath);
});

router.get("/", function (req, res) {
  res.render('index');
});



module.exports = router;