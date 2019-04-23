$('#openGallery').click(function(){
    $(window).scrollTop(0);
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

$('#editButton').click(function() {
    $('.property').each(function() {
        let thisItem={
        name: ($(this).children('.propertyName').text()),
        value: ($(this).children('.propertyContent').val())
        }
        console.log(thisItem);
    });
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
    var newImg = "<img class='galleryImage' src='"+mySrc+"'/>"
    $('.galleryImage').replaceWith(newImg);
}
