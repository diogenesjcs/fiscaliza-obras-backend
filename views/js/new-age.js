(function ($) {
    // Start of use strict
  const latLng = new google.maps.LatLng(-8.0634903,-34.9103391);
  const mapOptions = {
    center: latLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
                    { visibility: 'off' }
        ]
      },
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      }
    ]
  };
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);

  $.get('https://guarded-ravine-64092.herokuapp.com/api/getConstructionSites', (data) => {
    console.log(data);
    data.forEach((point) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(point.lat, point.lng),
        icon: 'img/construction-site.png',
        map
      });
      console.log(point);
      const cityCircle = new google.maps.Circle({
        center: new google.maps.LatLng(point.lat,point.lng),
        radius: point.complaints * 1000,
        fillColor: '#880000',
        map
      });
    });
  });


    // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(document).on('click', 'a.page-scroll', function (event) {
    const $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });

    // Highlight the top nav as scrolling occurs
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 100
  });

    // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(() => {
    $('.navbar-toggle:visible').click();
  });

    // Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 50
    }
  });
}(jQuery)); // End of use strict
