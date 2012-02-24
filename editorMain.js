//GLOBALS
var stage = null;

//MAIN FUNCTION - ENTRY POINT
function main() {
    //init stage
    stage = new Stage();
    
    //init transformer
    stage.transformBox = new EditTransform();

    //image test
    /*var img = new Image();
    img.src = 'clipart/img/technopolis.jpg';*/
    
    var r = new Rectangle(new Point(150, 150), new Point(200, 200)).toPolygon();
    var o = new Shaper('o', r);
    stage.addObject(o);
    
    //var c = o.getCenter();
    //o.rotate(0.4, c);
    //o.scale(1, 2, c);
    
    //image test
    var im = new Bitmap("testBitmap", "clipart/img/technopolis.jpg", 100, 100);
    stage.addObject(im);
    
    //image list
    var imgList = Dom().create('div', '', 'absolute', 5, 5, 390, 360, '', 'auto');
    
    for (var i = 0; i < 25; i++) {
        img = Dom().create('img', '', '', '', '', 175, 130);
        Dom(img).attr('src', 'clipart/img/technopolis.jpg').css('margin', '5px');
        imgList.appendChild(img);
    }
    
    var imgListWnd = new DomWnd('Select image', 550, 60, 400, 400);
    imgListWnd.addControl(imgList);
    
    var btn = Dom().create('button', '', 'absolute', imgListWnd.getWidth() / 2 - 50, imgListWnd.getHeight() - 30, 100, 25);
    Dom(btn).prop('innerHTML', 'Select');
    imgListWnd.addControl(btn);
}
