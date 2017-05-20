(function ($) {
    // Start of use strict
    const latLng = new google.maps.LatLng(-8.0634903, -34.9103391);
    const mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      draggable: true,
      zoomControl: true,
      scrollwheel: false,
      disableDoubleClickZoom: true,
    };
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $.get('https://guarded-ravine-64092.herokuapp.com/api/getConstructionSites', (data) => {
      console.log(data);

      var currWindow = false;
      data.forEach((point) => {
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h4>'+point.title+'</h4>'+
        '<div id="bodyContent">'+
        '<b>Orgão:</b> '+point.department+'<br/>'+
        '<b>Executor:</b> '+point.department+'<br/>'+
        '<b>Tipo da obra:</b> '+point.type+'<br/>'+
        '<b>Investimento: </b>'+(point.investment?'R$ '+point.investment:'Não informado')+'<br/>'+
        point.complaints+' pessoas denunciaram essa obra'+'<br/>'+
        '</div>'+
        '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(point.lat, point.lng),
          icon: 'img/construction-site.png',
          map
        });
        console.log(point);
        const cityCircle = new google.maps.Circle({
          center: new google.maps.LatLng(point.lat, point.lng),
          radius: point.complaints * 500,
          fillColor: '#880000',
          strokeOpacity: 0.3,
          strokeColor: '#880000',
          map
        });
        marker.addListener('click', function() {
          if(currWindow){
            currWindow.close();
          }
          currWindow = infowindow;
          infowindow.open(map, marker);
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
