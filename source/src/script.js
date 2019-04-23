$('#openGallery').click(function(){
    $('.galleryWindowContainer').fadeIn();
    $('.galleryFlex').css("pointer-events","none");
});

$('#closeGallery').click(function(){
    $('.galleryWindowContainer').fadeOut();
    $('.galleryFlex').css("pointer-events","all");
});


$('#gallLeft').click(function(){
    let count = selectedImage + $('.galleryImageFlexImage').length;
    count=(count-1) % ($('.galleryImageFlexImage').length);
    selectImage(count);
});

$('#gallRight').click(function(){
    let count = selectedImage + $('.galleryImageFlexImage').length;
    count=(count+1) % ($('.galleryImageFlexImage').length);

    selectImage(count);
});

$('.galleryImageFlexImage').click(function(){
    selectImage($(this)[0].id);
});

var selectedImage=0;
selectImage(0);

function selectImage(num){
    let myChildren = $('.galleryImageFlexImage#'+num);
    if(myChildren.length==0)
        return;

    //The image is valid!
    $('.galleryImageFlexImageSelected').removeClass('galleryImageFlexImageSelected');
    myChildren.addClass('galleryImageFlexImageSelected');

    selectedImage=num;
    let mySrc = myChildren[0].src;
    $('.galleryFlex').css('background-image','url('+mySrc+')');
    $('.galleryImage').attr('src',mySrc);
}
