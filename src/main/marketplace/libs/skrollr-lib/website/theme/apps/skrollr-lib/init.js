$(function(){
    var ps = $('.parallax-skrollr');
    var ce = $('.content-editor-page');
    if (!ps.length || ce.length) return;
    skrollr.init({
        forceHeight: true
    });
});