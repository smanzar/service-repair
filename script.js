$(document).ready(function(){
    $('.menu').on('click',function(e){
        e.stopPropagation();
        $('.sidenav').toggleClass('pushNav');
        $('.dim').toggleClass('overlay');
        $('body').toggleClass('flow');

    });
    $('body,html').on('click',function(e){
        $('.sidenav').removeClass('pushNav');
        $('.dim').removeClass('overlay');
        $('body').removeClass('flow');
    });    
    $('.sidenav').click(function(e){
        e.stopPropagation();
    });
});