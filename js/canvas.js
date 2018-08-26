var frontCanvas;
var backCanvas;
var frontShowing; // tracks which side is visible currently
var selectedCanvas;
var canvasHeight;
var canvasWidth;

$(document).ready( function(){
  setupCanvas();
});

function setupCanvas(){
  setupUploadImage();

  frontCanvas = new fabric.Canvas('front');
  backCanvas = new fabric.Canvas('back');
  frontShowing = true;
  selectedCanvas = frontCanvas;

  var canvasContainer = $('.canvas-container');
  canvasWidth = canvasContainer.width();
  canvasHeight = canvasContainer.height();

  frontCanvas.setWidth(canvasWidth);
  frontCanvas.setHeight(canvasHeight);

  backCanvas.setWidth(canvasWidth);
  backCanvas.setHeight(canvasHeight);

  setupSwitchCanvas();
  setupAddText();
  setupDeleteButton();
}

function setupGuides(){
  let frontGuide = new fabric.Rect({
    width: canvasWidth * 0.3,
    height: canvasHeight * 0.55,
    strokeDashArray: [10, 10],
    stroke: '#00FFFF',
    strokeWidth: 1,
    fill: 'rgba(0,0,0,0)',
    selectable: false,
    top: canvasHeight * 0.15
  })

  let backGuide = new fabric.Rect({
    width: canvasWidth * 0.3,
    height: canvasHeight * 0.55,
    strokeDashArray: [10, 10],
    stroke: '#00FFFF',
    strokeWidth: 1,
    fill: 'rgba(0,0,0,0)',
    selectable: false,
    top: canvasHeight * 0.15
  })

  frontCanvas.on('selection:created', function(){
    frontCanvas.add(frontGuide);
    frontGuide.centerH();
  })

  frontCanvas.on('selection:cleared', function(){
    frontCanvas.remove(frontGuide);
  })

  backCanvas.on('selection:created', function(){
    backCanvas.add(backGuide);
    backGuide.centerH();
  })

  backCanvas.on('selection:cleared', function(){
    backCanvas.remove(backGuide);
  })


}

function setupSwitchCanvas(){
  let btn = $('#switch-btn');
  $('.canvas-back').hide(); // hide back canvas

  btn.click(switchCanvas);
}

function switchCanvas(){
  let frontCanvasContainer = $('.canvas-front');
  let backCanvasContainer = $('.canvas-back');
  let btn = $('#switch-btn');
  let btnText = $('#switch-side-btn-text');

  if(frontShowing){
    frontCanvasContainer.hide();
    backCanvasContainer.show();
    btnText.text('Show Front');
    frontShowing = false;
    selectedCanvas = backCanvas;
  } else {
    frontCanvasContainer.show();
    backCanvasContainer.hide();
    btnText.text('Show Back');
    frontShowing = true;
    selectedCanvas = frontCanvas;
  }
}

function setupUploadImage(){
  let fileUpload = $('#image-upload');

  fileUpload.change(
    function handleImage(e){
      let reader = new FileReader();
      reader.onload = function(event){

        let imageObject = new Image();
        imageObject.src = event.target.result;

        imageObject.onload = function(){
          console.log("image uploaded!");

          // create fabric image from imageObject
          let image = new fabric.Image(imageObject);

          // prescale image
          if(image.height > 200 || image.width > 200){
            let ratio = Math.min(200 / image.height, 200 / image.width);
            image.scaleToWidth(image.width * ratio);
            image.scaleToHeight(image.height * ratio);
          }

          // position image
          image.set({
                    left: 10,
                    top: 10,
                });

          selectedCanvas.add(image);
        }
      }
      reader.readAsDataURL(e.target.files[0]);
  });
}

function setupAddText(){
  let textButton = $('#text-art-btn');

  textButton.click(function(){
    // Show text add menu
    let textArtContainer = $('.text-art-container');
    textArtContainer.addClass('show');

    $('#text-art-add-btn').on('click', addText);
  });
}

function addText() {
  let fontSelect = $('#text-art-font-select');
  let colorSelect = $('#text-art-color-select');

  let textArt = new fabric.IText("Double Click to Edit", {
    fontFamily: $('#text-art-font-select option:selected').text(),
    fill: colorSelect.css('background-color')
  });

  textArt.set({
    left: 10,
    top:10
  });

  selectedCanvas.add(textArt); // add created text to canvas

  let textArtContainer = $('.text-art-container');
  textArtContainer.removeClass('show'); // rehide text add menu
}

function setupDeleteButton(){
  let deleteButton = $('#delete-element-btn');

  deleteButton.hide();

  frontCanvas.on('selection:created', function(options) {
    deleteButton.show();
  })

  backCanvas.on('selection:created', function(options) {
    deleteButton.show();
  })

  frontCanvas.on('selection:cleared', function(options) {
    deleteButton.hide();
  })

  backCanvas.on('selection:cleared', function(options) {
    deleteButton.hide();
  })

  deleteButton.click(function() {
    selectedCanvas.remove(selectedCanvas.getActiveObject());
  });
}

// allows you to change the image on the canvas
function changeImage(frontURL, backURL){
  frontCanvas.clear();
  backCanvas.clear();
    var frontImage = fabric.Image.fromURL(
      frontURL,
      function(oImg){
        oImg.scaleToWidth(canvasWidth);
        oImg.scaleToHeight(canvasHeight);
        oImg.selectable = false; // not selectable
        frontCanvas.add(oImg);

        var backImage = fabric.Image.fromURL(
          backURL,
          function(oImg){
            oImg.scaleToWidth(canvasWidth);
            oImg.scaleToHeight(canvasHeight);
            oImg.selectable = false; // not selectable
            backCanvas.add(oImg);
            setupGuides(); // setup guides after images have loaded in!
        });
    });
}