var $ = require("jquery");

var form = $(".data")[0];
var output = $(".output");
var oReq;

// TODO: use promises or something and cancel previous request if fields updated
function dankMeme() {
  $("img.output").attr("src", "");
  oReq = new XMLHttpRequest();
  oReq.open("post", '/parrotify.gif', true);
  oReq.responseType = "blob";
  oReq.onload = function (e) {
    var blob = oReq.response;
    var urlCreator = window.URL || window.webkitURL;
    var imgSrc = urlCreator.createObjectURL(blob);
    output.attr("src", imgSrc);
  };
  oReq.send(new FormData(form));
}

$(".file-upload").change(function () {
  $(".afterUpload").removeClass("hidden");
});

$("input").change(dankMeme);

$("input").on("input", dankMeme);
