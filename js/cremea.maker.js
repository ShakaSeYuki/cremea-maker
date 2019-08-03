// canvasの指定
var canvas = document.getElementById('cremea');
var ctx = canvas.getContext('2d');

// カラーピッカー生成するタグ
var picker = document.getElementById('picker');

// 円の描画
var circleDraw = function(ctx, x, y, radius, fillColor, strokeColor) {
  ctx.beginPath();
  // 塗りつぶし色
  ctx.fillStyle = fillColor;
  // 枠線の色
  ctx.strokeStyle = strokeColor;
  // 円を描画
  ctx.arc(x, y, radius, 0, Math.PI*2, true);
  // 塗りつぶし
  ctx.fill();
  // 枠線
  ctx.stroke();
};

// 星の描画
var starDraw = function(ctx, x, y, radius, fillColor, strokeColor, sides, sideIndent, offsetAngle){
  ctx.beginPath();

  var sideIndentRadius = radius * (sideIndent || 0.38);

  var radOffset = (offsetAngle) ? offsetAngle*Math.PI/180: -Math.PI/2;

  var radDiv = (Math.PI*2)/sides/2;
  // 塗りつぶし色
  ctx.fillStyle = fillColor;
  // 枠線の色
  ctx.strokeStyle = strokeColor;
  ctx.moveTo(
      x + Math.cos(radOffset)*radius,
      y + Math.sin(radOffset)*radius
  );
  for (var i=1; i<=sides*2; ++i) {
      var rad = radDiv*i + radOffset;
      // 内円, 外円を交互にパスをセット
      var len = (i%2) ? sideIndentRadius : radius;
      ctx.lineTo(
          x + Math.cos(rad)*len,
          y + Math.sin(rad)*len
      );
  }
  ctx.fill();
  ctx.stroke();
}

function getCircleDraw(fColor, sColor) {
  // 円の描画位置
  var x = 200;
  var y = 200;
  // 塗りつぶし色
  var fillColor = (fColor)? fColor: '#000';
  // 枠線色
  var strokeColor = (sColor) ? sColor: '#000';
  // １番大きい円（外側）
  circleDraw(ctx, x, y, 197, fillColor, strokeColor);
  // １番大きい円（内側）
  circleDraw(ctx, x, y, 165, '#fff', strokeColor);
  x = 300;
  // 右側に入れる円（外側）
  circleDraw(ctx, x, y, 93, fillColor, strokeColor);
  // 右側に入れる円（内側）
  circleDraw(ctx, x, y, 65, '#fff', strokeColor);
}

// 星の描画
function getDraw(obj, fColor, sColor) {
  
  var selectColor;
  // 星の描画位置
  var x = 120;
  var y = 260;
  // 色設定(星の数変更時)
  for( var i = 0; i < picker.children.length; i++ ) {
    if(picker.children[i].getAttribute('setcolor') == 'true') {
      selectColor = picker.children[i].getAttribute('color');
    }
  }
  // 塗りつぶし色
  var fillColor = (fColor)? fColor: selectColor;
  // 枠線色
  var strokeColor = (sColor) ? sColor: selectColor;
  // 変の数
  var sides = (obj) ? obj.value: 6;
  // 凹ませ具合
  var sideIndent = 0.48;
  // 星の角度
  var offsetAngle = 250;
  // 描画クリア
  ctx.clearRect(0, 0, 400, 400);
  // 円再描画
  getCircleDraw(fillColor, strokeColor);
  // 星の描画
  starDraw(ctx, x, y, 63, fillColor, strokeColor, sides, sideIndent, offsetAngle);
}

// 生成する色配列
var colors = [
  '#000000', '#808080',
  '#ff0000', '#ff7f7f',
  '#ff007f', '#ff7fbf',
  '#ff00ff', '#ff7fff',
  '#7f00ff', '#bf7fff',
  '#0000ff', '#7f7fff',
  '#007fff', '#7fbfff',
  '#00ffff', '#7fffff',
  '#00ff7f', '#7fffbf',
  '#00ff00', '#7fff7f',
  '#7fff00', '#bfff7f',
  '#ffff00', '#ffff7f',
  '#ff7f00', '#ffbf7f'
];
// 生成
colors.forEach(function(color, i) {
  colorSpan = document.createElement('span');
  colorSpan.innerHTML = '■';
  colorSpan.classList.add('color-change');
  colorSpan.style.color = color;
  colorSpan.style.fontSize = '200%';
  colorSpan.setAttribute('color', color);
  colorFlg = (i == 0) ? true: false;
  colorSpan.setAttribute('setcolor', colorFlg);
  colorSpan.setAttribute('onclick', 'changeColor(this)');
  picker.appendChild(colorSpan);
});

// 色変更
function changeColor(obj) {
  var colorChange = document.getElementsByClassName('color-change');
  for( var i = 0; i < colorChange.length; i++ ) {
    // 一旦falseに
    colorChange[i].setAttribute('setcolor', false);
  };
  cremeaColor = obj.getAttribute('color');
  obj.setAttribute('setcolor', true);
  cremeaStar = document.getElementById('cremea-star');
  selectColor = document.getElementById('select-color');
  selectColor.style.color = cremeaColor;
  // 描画クリア
  ctx.clearRect(0, 0, 400, 400);
  // 再描画
  getDraw(cremeaStar, cremeaColor, cremeaColor);
}

// 画像の保存
var downloadLink = document.getElementById('download-link');
var filename = 'cremea-maker.png';
var button = document.getElementById('download-button');
button.addEventListener('click', function() {

  if (canvas.msToBlob) {
    // IE・edge
    var blob = canvas.msToBlob();
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // chromeなど
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = filename;
    downloadLink.click();
  }

});

// 描画
getDraw();
