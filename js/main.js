function init() {
  var carousel = new Carousel("#carousel");

  // remove loading
  $('#loading').remove();
  $('#carousel')
    .removeClass('hide')
    .addClass('animated bounceInDown')
    .on('animationend', function () {
      console.log('xxx');
    });
  $('body').css('background', 'silver');

  setTimeout(function () {
    $('#carousel').removeClass('animated bounceInDown');
  }, 1000);

  // ga
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  ga('create', 'UA-36091301-5', 'sinaapp.com');
  ga('send', 'pageview');
}
