var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
    canvas.width = 600;
    canvas.height = 600;
var ctx = canvas.getContext('2d');


function popupResult(result) {
  var html;
  if (result.html) {
  	html = result.html;
  }
  if (result.src) {
  	html = '<img src="' + result.src + '" />' +
    '<a href="'+ result.src +'" id="downloadlink" class="button" download="moc17.jpg">Download</a>' +
    '<button class="confirm button" tabindex="1">Cancel</button>';
  }
  swal({
	title: '',
    html: true,
    text: html,
    animation: 'slide-from-top',
    confirmButtonColor:	"#EA6680",
   });
}

/**
 * Draw image
 */
function drawFrame() {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = 'images/frame.png';  
  img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    popupResult({
			src: document.getElementById('imageCanvas').toDataURL('image/png'),
		});
	console.log('popup ok');
  }
}


function drawProfPict(src) {
  var img = new Image();
  img.onload = function(){
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawFrame();
  }

  img.src = src;
}

/**
 * Load image from user
 */
function handleImage(e) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var reader = new FileReader();
  reader.onload = function(event) {
    $('.cr-slider').css('visibility', 'visible');
    $('.loader').remove();

    // Resize the image
    var image = new Image();
    image.onload = function (imageEvent) {

        // Resize the image
        var canvas = document.createElement('canvas'),
            max_size = 1000,// TODO : pull max size from a site config
            width = image.width,
            height = image.height;
        if (width > height) {
            if (width > max_size) {
                height *= max_size / width;
                width = max_size;
            }
        } else {
            if (height > max_size) {
                width *= max_size / height;
                height = max_size;
            }
        }
		canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        basic.croppie('bind', {
            url: dataUrl,
        });
    }
    image.src = event.target.result;
  }

  reader.onloadstart = function(event) {
    $('.cr-viewport').append('<div class="loader"></div>');
  }
  reader.readAsDataURL(e.target.files[0]);
}


/**
 * Download image from canvas
 */
function downloadCanvas(link, canvasId, filename) {
  link.href = document.getElementById(canvasId).toDataURL('image/jpeg');
  link.download = filename;
}

$('#downloadlink').on('click', '.sweet-alert', function() {
  downloadCanvas(this, 'imageCanvas', 'moc17.jpg');
});


var basic = $('#demo-basic').croppie({
    viewport: {
        width: Math.min(300, window.innerWidth - 50),
        height: Math.min(300, window.innerWidth - 50)
    },
    boundary: {
      width: Math.min(300, window.innerWidth - 50),
      height: Math.min(300, window.innerWidth - 50),
    },
});


$('.basic-result').on('click', function(e) {
  e.preventDefault();
  console.log('OK');
  var downloadButton = this;
  basic.croppie('result', {
		type: 'canvas',
	}).then(function (resp) {
		drawProfPict(resp);
	});
});
