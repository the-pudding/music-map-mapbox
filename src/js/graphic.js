/* global d3 */
function resize() {}

var player;
var map;
var viewportWidth;
var allStarted = false;
var mobile;
var formatNumber = d3.format(",.0f");
var toolTipVisible = false;
var startButton = d3.select(".start-button");
var infoModal = d3.select(".info-modal");
var startModal = d3.select(".start-modal");

var infoModalClose = infoModal.select(".info-modal-close").on("click",function(d){
  infoModal.classed("info-modal-visible",false);
})
var mapToolTip = d3.select(".map-tool-tip");
var mapToolTipGeo = mapToolTip.select(".map-tool-tip-geo");

var toolbarTop = d3.select(".top-toolbar").on("mouseenter",function(d){
  mapToolTip.style("display",null)
  toolTipVisible = false;
});
var colorEasingFillScale = d3.scaleLinear().domain([0,1]).range([.85,.99]);
var songFiltered = false;
var volumeButton = d3.select(".top-toolbar-volume");
var searchDiv = d3.select(".top-toolbar-search-box");
var searchInput = searchDiv.select("input");
var searchResults = searchDiv.select(".top-toolbar-search-box-results")
var toolbarRight = d3.select('.tool-bar-right')
  .on("mouseenter",function(d){
    d3.select(this).style("right","0px")
    toolbarRight.select(".tool-bar-right-title-vert").style("display","none");
    mapToolTip.style("display",null)
    toolTipVisible = false;
  })
  .on("mouseleave",function(d){
    d3.select(this).style("right",null)
    toolbarRight.select(".tool-bar-right-title-vert").style("display",null);
  })
  ;


var songToolbarInfo = d3.select(".top-toolbar-song-wrapper");
var songToolbarInfoTitle = songToolbarInfo.select(".top-toolbar-song-title");
var songToolbarInfoArtist = songToolbarInfo.select(".top-toolbar-song-artist");
var playPausePutton = d3.select(".top-toolbar-song-pause-play");
var songSelected = "";
var artistSelected = "";
var geoSelected = "";
var songSelectDiv = d3.select(".song-filter");
songSelectDiv.style("transform","none")




function init() {


  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    mobile = true;
  }

  viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  var toolbarInfo = d3.select(".top-toolbar-info").on("click",function(d){
    var visible = infoModal.classed("info-modal-visible");
    if(!visible){
      infoModal.classed("info-modal-visible",true);
    }
    else{
      infoModal.classed("info-modal-visible",false);
    }
  });

  d3.select(".top-toolbar-title-text").select("select").on("change",function(d){
    var selected = d3.select(this).property('value')
    if(selected == "dec-2017"){
      window.location.href = 'https://pudding.cool/2018/01/music-map';
    }
  })

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}

window.onYouTubeIframeAPIReady = function() {



  var countryHighlighted = "";

  var done = false;

  d3.csv("assets/data/geo_info.csv",function(geo_info){
  d3.csv("assets/data/track_info.csv",function(track_data){
  d3.csv("assets/data/city_data_new.csv",function(city_data){
  d3.csv("assets/data/country_data.csv",function(country_data){
  d3.csv("assets/data/a1.csv",function(aOneLookup){
  d3.csv("assets/data/a0.csv",function(aZeroLookup){

    var geoInfoMap = d3.map(geo_info,function(d){return d.longitude+d.latitude});
    var trackInfoMap = d3.map(track_data,function(d){return d.track_link});
    var trackInfoNameMap = d3.map(track_data,function(d){return d.track_name});

    var randomItem = country_data[Math.round(Math.random()*country_data.length)]

    mapboxgl.accessToken = 'pk.eyJ1IjoiZG9jazQyNDIiLCJhIjoiY2trOXV2MW9zMDExbTJvczFydTkxOTJvMiJ9.7qeHgJkUfxOaWEYtBGNU9w';
    mapboxgl.setRTLTextPlugin(
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      null,
      true // Lazy load the plugin
    );
    // mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js');

    map = new mapboxgl.Map({
        container: 'map',
        zoom: 3,
        center: [randomItem["longitude"], randomItem["latitude"]],
        style: 'mapbox://styles/dock4242/cjhqxa1mp2fbk2rphmmwonf3s',
        // pitch:50,
        hash: false,
        attributionControl:false
    });

    var positionControls = 'bottom-right';
    if(mobile && viewportWidth < 575){
      positionControls = 'top-right'
    }

    map.addControl(new mapboxgl.NavigationControl(),positionControls);

    var aOneMap = d3.map(aOneLookup,function(d){return d.id;});
    var aZeroMap = d3.map(aZeroLookup,function(d){return d.id;});

    var colorsManual = [{
        line:"red",
        fill:"rgb(20,255,56)",
        label:"rgb(45,98,53)" //green gucci
      },
      {
        line:"red",
        fill:"rgb(130,20,255)",
        label:"rgb(88,29,154)" //purple criminal
      },
      {
        line:"red",
        fill:"rgb(0,34,255)",
        label:"rgb(57,113,154)" //blue perfect
      },
      {
        line:"red",
        fill:"rgb(255,0,0)",
        label:"rgb(143,10,10)" //red havavna
      },
      {
        line:"red",
        fill:"rgb(255,153,20)",
        label:"rgb(236,135,4)" //orange gummo
      },
      {
        line:"red",
        fill:"rgb(255,20,196)",
        label:"rgb(193,31,153)" //pink panama
      },
      {
        line:"red",
        fill:"rgb(255,192,20)",
        label:"rgb(170,131,24)" //brown (peeka boo)
      },
      {
        line:"red",
        fill:"rgb(179,19,190)",
        label:"rgb(171,17,182)" //fushia (mwaka)
      },
      {
        line:"red",
        fill:"rgb(255,235,20)",
        label:"rgb(171,17,182)" //yellow //muchas
      }
    ];

    var colorsNew = [
      "#ff7f0e",
      "#9467bd",
      "#98df8a",
      "#1f77b4",
      "#9edae5",
      "#f7b6d2",
      "#c5b0d5",
      "#d62728",
      "#bcbd22",
      "#ff9896",
      "#dbdb8d",
      "#ffbb78",
      "#2ca02c",
      "#e377c2",
      "#c49c94",
      "#17becf",
      "#8c564b",
      "#aec7e8"
    ];

    // shuffle(colorsNew);
    colorsNew = colorsNew.concat(d3.schemePastel2).concat(d3.schemePastel2);

    function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
    }

    // shuffle(colorsNew);

    colorsManual = colorsNew.map(function(d){
      return {label:d,fill:d};
    });

    var topSongs = d3.nest().key(function(d){
        return d.track_name;
      })
      .rollup(function(leaves){
        return leaves.length;
      })
      .entries(city_data).sort(function(a,b){
        return b.value - a.value;
      })
      ;

    topSongs = topSongs.map(function(d){
      return d.key;
    });

    var labelColors = colorsManual.map(function(d,i){
      return [topSongs[i],d3.color(d.fill).darker().toString()]
    })

    var toolbarRightSong = toolbarRight.select(".tool-bar-right-songs")
      .selectAll("div")
      .data(labelColors.slice(0,15))
      .enter()
      .append("div")
      .attr("class","tool-bar-right-songs-song-wrapper")

    toolbarRightSong.append("div").attr("class","tool-bar-right-songs-song-circle")
      .style("border-color",function(d){
        return d[1];
      })
      .style("background-color",function(d){
        let color = d3.hsl(d[1]);
        color.l = colorEasingFillScale(color.l);
        color = color.toString()

        return color;
      })
      ;
    toolbarRightSong.append("p").attr("class","tool-bar-right-songs-song-text")
      .text(function(d,i){
        return (i+1)+". "+d[0];
      });

    var colorSliceAmount = labelColors.length;

    var otherScale = d3.scaleLinear().domain([colorSliceAmount,topSongs.length-1]).range(["#929292","#f6f6f4"]);

    var colorEasingFill = .5
    var colorEasingLine = .5

    var countryStopsFill = country_data.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.track_name) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.track_name)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.track_name));
      }
      color = d3.hsl(color);
      color.l = colorEasingFillScale(color.l);
      color = color.toString()
      return [d.iso,color]
    });

    var countryStopsLine = country_data.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.track_name) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.track_name)]["label"];
      }
      else{
        color = otherScale(topSongs.indexOf(d.track_name));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingLine;
      // color = color.toString()
      return [d.iso,color]
    });


    var topByCountry = country_data.map(function(d){
      return {key:d.iso,value:d.track_name};
    })

    var topByAdminOne = d3.nest().key(function(d){
        return d.boundaries_admin_1;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var adminOneSongMap = d3.map(topByAdminOne,function(d){return d.key});

    var topByAdminTwo = d3.nest().key(function(d){
        return d.boundaries_admin_2;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)
    //
    var topByAdminThree = d3.nest().key(function(d){
        return d.boundaries_admin_3;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var topByAdminFour = d3.nest().key(function(d){
        return d.boundaries_admin_4;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var topByAdminFive = d3.nest().key(function(d){
        return d.boundaries_admin_5;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var topByPostalOne = d3.nest().key(function(d){
        return d.boundaries_postal_1;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var topByPostalTwo = d3.nest().key(function(d){
        return d.boundaries_postal_2;
      })
      .rollup(function(leaves){
        return d3.nest().key(function(d){
          return d.track_name
        })
        .rollup(function(leaves_sub){
          return d3.sum(leaves_sub,function(d){return +d.views;});
        })
        .entries(leaves).sort(function(a,b){return +b.value - +a.value;}).slice(0,1)[0].key;
      })
      .entries(city_data)

    var stopsAdminOneLine = topByAdminOne.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["label"];
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingLine;
      // color = color.toString()
      return [d.key,color]
    });

    var stopsAdminOneFill = topByAdminOne.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.color(color).brighter();
      color = d3.hsl(color);
      color.l = colorEasingFillScale(color.l);
      color = color.toString()
      return [d.key,color]
    });

    var stopsAdminTwoLine = topByAdminTwo.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["label"];
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingLine;
      // color = color.toString()
      return [d.key,color]
    });

    var stopsAdminTwoFill = topByAdminTwo.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.color(color).brighter();
      color = d3.hsl(color);
      color.l = colorEasingFillScale(color.l);
      color = color.toString()
      return [d.key,color]
    });

    //
    var stopsAdminThreeLine = topByAdminThree.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingFillScale(color.l);
      // color = color.toString()
      return [d.key,color]
    });
    //
    var stopsAdminFourLine = topByAdminFour.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingFillScale(color.l);
      // color = color.toString()
      return [d.key,color]
    });

    var stopsAdminFiveLine = topByAdminFive.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingFillScale(color.l);
      // color = color.toString()
      return [d.key,color]
    });
    //

    var stopsPostalOneFill = topByPostalOne.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      color = d3.hsl(color);
      color.l = colorEasingFillScale(color.l);
      color = color.toString()
      return [d.key,color]
    });

    var stopsPostalOneLine = topByPostalOne.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingFillScale(color.l);
      // color = color.toString()
      return [d.key,color]
    });
    //
    var stopsPostalTwoLine = topByPostalTwo.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      // color = d3.hsl(color);
      // color.l = colorEasingFillScale(color.l);
      // color = color.toString()
      return [d.key,color]
    });

    var stopsPostalTwoFill = topByPostalTwo.map(function(d){
      var color;
      if (topSongs.slice(0,colorSliceAmount).indexOf(d.value) > -1){
        color = colorsManual[topSongs.slice(0,colorSliceAmount).indexOf(d.value)]["fill"];
        // color.l = colorEasingFill;
        // color = color.toString()
      }
      else{
        color = otherScale(topSongs.indexOf(d.value));
      }
      color = d3.hsl(color);
      color.l = colorEasingFillScale(color.l);
      color = color.toString()
      return [d.key,color]
    });


    map.on('load',function(){

      var maxValue = 13;



      var vtMatchProp = "name";

      map.addSource("admin-0", {
        type: "vector",
        url: "mapbox://mapbox.enterprise-boundaries-a0-v1"
      });
      //
      map.addSource("admin-1", {
        type: "vector",
        url: "mapbox://mapbox.enterprise-boundaries-a1-v1"
      });

      // map.addSource("admin-2", {
      //   type: "vector",
      //   url: "mapbox://mapbox.enterprise-boundaries-a2-v1"
      // });

      // map.addSource("bathymetry", {
      //   type: "vector",
      //   url: "mapbox://mslee.f67c1615"
      // });

      // map.addSource("admin-3", {
      //   type: "vector",
      //   url: "mapbox://mapbox.enterprise-boundaries-a3-v1"
      // });
      //
      // map.addSource("admin-4", {
      //   type: "vector",
      //   url: "mapbox://mapbox.enterprise-boundaries-a4-v1"
      // });
      //
      // map.addSource("admin-5", {
      //   type: "vector",
      //   url: "mapbox://mapbox.enterprise-boundaries-a5-v1"
      // });

      map.addSource("postal-1", {
        type: "vector",
        url: "mapbox://mapbox.enterprise-boundaries-p1-v1"
      });
      //
      // map.addSource("postal-2", {
      //   type: "vector",
      //   url: "mapbox://mapbox.enterprise-boundaries-p2-v1"
      // });

      var maxZoomAmount = 6;
      var lineWidthBig = 1;
      var lineWidthSmall = 1;
      var fillOpacity = 1;

      // map.addLayer({
      //   "id": "water-4",
      //   "type": "fill",
      //   "source": "bathymetry",
      //   "source-layer": "ne_10m_bathymetry_J_1000",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":1,
      //       "fill-color": "#c8cfd0"
      //   }
      // }, 'city-dots');
      //
      // map.addLayer({
      //   "id": "water-5",
      //   "type": "fill",
      //   "source": "bathymetry",
      //   "source-layer": "ne_10m_bathymetry_H_3000",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":1,
      //       "fill-color": "#c3cbcc"
      //   }
      // }, 'city-dots');




      map.addLayer({
        "id": "admin-0-fill",
        "type": "fill",
        "source": "admin-0",
        "maxzoom": maxZoomAmount,
        "source-layer": "boundaries_admin_0",
        "paint": {
            "fill-outline-color":"rgba(0,0,0,0)",
            // "default":"rgba(0,0,0,0)",
            "fill-opacity":fillOpacity,
            "fill-color": {
                "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": countryStopsFill
            }
        }
      }, 'city-dots-2');

      // filter: ,

      var filterValue = ["in","id"].concat(topByAdminOne.map(function(d){return d.key;}));

      map.addLayer({
        "id": "admin-1-fill",
        "type": "fill",
        "filter":filterValue,
        "maxzoom": maxZoomAmount,
        "source": "admin-1",
        "source-layer": "boundaries_admin_1",
        "paint": {
            "fill-outline-color":"rgba(0,0,0,0)",
            "fill-opacity":fillOpacity,
            "fill-color": {
                "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": stopsAdminOneFill
            }
        }
      }, 'city-dots-2');

      map.addLayer({
        "id": "postal-1-fill",
        "maxzoom": maxZoomAmount,
        "type": "fill",
        "source": "postal-1",
        "source-layer": "boundaries_postal_1",
        "paint": {
            "fill-outline-color":"rgba(0,0,0,0)",
            // "default":"rgba(0,0,0,0)",
            "fill-opacity":fillOpacity,
            "fill-color": {
                "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": stopsPostalOneFill
            }
        }
      }, 'city-dots-2');

      // map.addLayer({
      //   "id": "admin-2-fill",
      //   "type": "fill",
      //   "minzoom": 4,
      //   "maxzoom": maxZoomAmount,
      //   "source": "admin-2",
      //   "source-layer": "boundaries_admin_2",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":fillOpacity,
      //       "fill-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminTwoFill
      //       }
      //   }
      // }, 'city-dots');

      // map.addLayer({
      //   "id": "postal-2-fill",
      //   "minzoom": 4,
      //   "maxzoom": maxZoomAmount,
      //   "type": "fill",
      //   "source": "postal-2",
      //   "source-layer": "boundaries_postal_2",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":fillOpacity,
      //       "fill-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsPostalTwoFill
      //       }
      //   }
      // }, 'city-dots');

      map.addLayer({
        "id": "country-borders-bg",
        "type": "line",
        "source": "admin-0",
        "source-layer": "boundaries_admin_0",
        "paint": {
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              // zoom is 5 (or less) -> circle radius will be 1px
              2, 1,
              // zoom is 10 (or greater) -> circle radius will be 5px
              6, 8
            ],
            "line-opacity":.2,
            "line-blur":0,
            "line-color": "rgb(214,214,214)"
        }
      }, 'city-dots-2');

      map.addLayer({
        "id": "postal-1-lines",
        "type": "line",
        // "minzoom": 6,
        "source": "postal-1",
        "source-layer": "boundaries_postal_1",
        "paint": {
            "line-opacity":.1,
            "line-blur":0,
            "line-width":lineWidthSmall,
            "line-color": {
              "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": stopsPostalOneLine
            }

        }
      }, 'city-dots-2');

      map.addLayer({
        "id": "admin-0-lines",
        "type": "line",
        "source": "admin-0",
        "source-layer": "boundaries_admin_0",
        "paint": {
            "line-opacity":.2,
            "line-blur":0,
            "line-width":lineWidthSmall,
            "line-color": {
              "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": countryStopsLine
            }
        }
      }, 'city-dots-2');

      map.addLayer({
        "id": "admin-0-lines-background",
        "type": "line",
        "source": "admin-0",
        "filter":["in", "id", "XX"],
        "maxzoom": maxZoomAmount,
        "source-layer": "boundaries_admin_0",
        "paint": {
            "line-width": [
              "interpolate", ["linear"], ["zoom"],
              // zoom is 5 (or less) -> circle radius will be 1px
              2, 1,
              // zoom is 10 (or greater) -> circle radius will be 5px
              8, 5
            ],
            "line-opacity":.5,
            "line-blur":0,
            "line-color": "rgb(100,100,100)"
        }
      }, 'city-dots-2');

      map.addLayer({
        "id": "admin-1-lines",
        "type": "line",
        // "maxzoom": 6,
        "source": "admin-1",
        "source-layer": "boundaries_admin_1",
        "paint": {
            "line-blur":0,
            "line-width":lineWidthSmall,
            "line-opacity":.2,
            "line-color": {
              "default":"rgba(0,0,0,0)",
                "property": "id",
                "type": "categorical",
                "stops": stopsAdminOneLine
            }

        }
      }, 'city-dots-2');
      //
      // map.addLayer({
      //   "id": "admin-2-lines",
      //   // "minzoom": 3,
      //   "type": "line",
      //   "source": "admin-2",
      //   "source-layer": "boundaries_admin_2",
      //   "paint": {
      //       "line-opacity":.2,
      //       "line-blur":0,
      //       "line-width":lineWidthSmall,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminTwoLine
      //       }
      //
      //   }
      // }, 'city-dots');

      // map.addLayer({
      //   "id": "admin-3-lines",
      //   // "minzoom": 6,
      //   "type": "line",
      //   "source": "admin-3",
      //   "source-layer": "boundaries_admin_3",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-blur":0,
      //       "line-width":lineWidthSmall,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminThreeLine
      //       }
      //
      //   }
      // }, 'city-dots');
      // //
      // map.addLayer({
      //   "id": "admin-4-lines",
      //   // "minzoom": 6,
      //   "type": "line",
      //   "source": "admin-4",
      //   "source-layer": "boundaries_admin_4",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-blur":0,
      //       "line-width":lineWidthSmall,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminFourLine
      //       }
      //
      //   }
      // }, 'city-dots');
      // //
      // map.addLayer({
      //   "id": "admin-5-lines",
      //   // "minzoom": 6,
      //   "type": "line",
      //   "source": "admin-5",
      //   "source-layer": "boundaries_admin_5",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-blur":0,
      //       "line-width":lineWidthSmall,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminFiveLine
      //       }
      //
      //   }
      // }, 'city-dots');

      // map.addLayer({
      //   "id": "postal-2-lines",
      //   "minzoom": 7,
      //   "type": "line",
      //   "source": "postal-2",
      //   "source-layer": "boundaries_postal_2",
      //   "paint": {
      //       "line-opacity":.2,
      //       "line-blur":0,
      //       "line-width":lineWidthSmall,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsPostalTwoLine
      //       }
      //
      //   }
      // }, 'city-dots');
      //


      // map.addLayer({
      //   "id": "admin-0-lines",
      //   "type": "line",
      //   "source": "admin-0",
      //   "source-layer": "boundaries_admin_0",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-blur":0,
      //       "line-width":1,
      //       "line-color": {
      //         "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": countryStops
      //       }
      //
      //   }
      // }, 'city-dots');
      // //


      // map.addLayer({
      //   "id": "admin-1-lines",
      //   "type": "line",
      //   "source": "admin-1",
      //   "source-layer": "boundaries_admin_1",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminOne
      //       }
      //   }
      // }, 'city-dots');
      //
      // map.addLayer({
      //   "id": "admin-1-fill",
      //   "type": "fill",
      //   "source": "admin-1",
      //   "source-layer": "boundaries_admin_1",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":1,
      //       "fill-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminOne
      //       }
      //   }
      // }, 'city-dots');
      //
      // map.addLayer({
      //   "id": "admin-2-lines",
      //   "type": "line",
      //   "source": "admin-2",
      //   "source-layer": "boundaries_admin_2",
      //   "paint": {
      //       "line-opacity":1,
      //       "line-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminTwo
      //       }
      //   }
      // }, 'city-dots');
      //
      // map.addLayer({
      //   "id": "admin-2-fill",
      //   "type": "fill",
      //   "source": "admin-2",
      //   "source-layer": "boundaries_admin_2",
      //   "paint": {
      //       "fill-outline-color":"rgba(0,0,0,0)",
      //       // "default":"rgba(0,0,0,0)",
      //       "fill-opacity":1,
      //       "fill-color": {
      //           "default":"rgba(0,0,0,0)",
      //           "property": "id",
      //           "type": "categorical",
      //           "stops": stopsAdminTwo
      //       }
      //   }
      // }, 'city-dots');



      var trackLayers = ['country-label','major-city-label-2','minor-city-label-2','medium-city-label-2'];

      for (var layer in trackLayers){
        map.setPaintProperty(trackLayers[layer], 'text-color', {"base":"rgb(29,27,27)","stops":labelColors,"type":"categorical","property":"track_name","base":1,"default":"rgb(29,27,27)"});
      }

      map.setLayoutProperty('city-dots-2', 'visibility', 'visible');
      map.setPaintProperty('city-dots-2', 'circle-color', {"base":"rgb(29,27,27)","stops":labelColors,"type":"categorical","property":"track_name","base":1,"default":"rgb(29,27,27)"});
      map.setPaintProperty('city-dots-2', 'circle-stroke-color', {"base":"rgb(29,27,27)","stops":labelColors,"type":"categorical","property":"track_name","base":1,"default":"rgb(29,27,27)"});

      map.setLayerZoomRange('city-dots-2', maxZoomAmount, 24);

      var color_dds = { "property": "id", "type": "categorical", "default": "rgba(0, 0, 0, 0)"}

      d3.select(".player-button").on("click",function(d){
        player.pauseVideo();
      })

      d3.select("body").on("mousemove",function(d){
        var mouseCoor = d3.mouse(this);
        mapToolTip.style("transform","translate("+(mouseCoor[0]+50)+"px,"+mouseCoor[1]+"px)")
      })


      var playerInfo = d3.select(".player-track-info");
      var playerTrackWrapper = playerInfo.select(".player-track-info-track-wrapper");
      var playerTrackName = playerTrackWrapper.select(".player-track-info-track");
      var playerArtistName = playerTrackWrapper.select(".player-track-info-artist");

      var playerStatsWrapper = playerInfo.select(".player-track-info-stats-wrapper");
      var playerStatsLocal = playerStatsWrapper.select(".player-track-info-stats-local")

      // map.setPaintProperty('ne-10m-admin-0-countries-9ar5oc', 'fill-color', {
      //   property: 'ISO_A2',
      //   type:"categorical",
      //   stops: countryColors
      // });
      //
      // map.moveLayer('ne-10m-admin-0-countries-9ar5oc','test-4hdya4');
      //
      // function country_make_same_color_for_track(){
      //   if(trackMap.has(e.features[0].properties.ISO_A2)){
      //     var trackData = trackMap.get(e.features[0].properties.ISO_A2)
      //     var countries = countryMap.get(trackData.track_name);
      //
      //     var filter = countries.values.reduce(function(memo, feature) {
      //         memo.push(feature.iso);
      //         return memo;
      //     }, ['in', 'ISO_A2']);
      //
      //     console.log(filter);
      //
      //     map.setFilter('ne-10m-admin-0-countries-9ar5oc', filter);
      //   }
      // }
      //
      // map.on('mousemove', 'population', function(e) {
      //   map.getCanvas().style.cursor = 'pointer';
      //   // console.log(e.features[0]);
      //
      //   // var trackLink = trackData.track_link.replace("https://www.youtube.com/watch?v=","");
      //
      //   // var relatedFeatures = map.queryRenderedFeatures('population', {
      //   //   // sourceLayer: 'population',
      //   //   filter: ['in', 'population', feature.properties.CONTINENT]
      //   // });
      // });
      //
      var flying = false;
      var videoOnMap = false;

      map.on('movestart', function(e){
        hideToolTip();
        if(!flying){
          playerElementWrapper.classed("player-fixed-moved",false).style("top",null).style("left",null);
        }
        var videoOnMap = false;
        if(!songFiltered){
          songSelectDiv.style("transform","none")
        }
      });

      // map.on('moveend', function(e){
      //   playerElementWrapper.classed("player-fixed-moved",false);
      // });

      var topLayer = map.getStyle().layers[map.getStyle().layers.length-1].id;


      var countryFilter = null;
      var majorCityFilter = map.getFilter('major-city-label-2');
      var minorCityFilter = map.getFilter('minor-city-label-2');
      var mediumCityFilter = map.getFilter('medium-city-label-2');

      if(!mobile){
        map.on('mousemove', function(e) {

          if(toolTipVisible==false){
            mapToolTip.style("display","block")
            toolTipVisible = true;
          }

          var featureCountry = map.queryRenderedFeatures(e.point,{ layers: ['admin-0-fill'] });
          var countryFound = false;

          if(featureCountry.length > 0){
            var data = featureCountry[0]["properties"]["id"];
            countryFound = data;
            map.setFilter('admin-0-lines-background',['in',"id",data]);
          }

          var features = map.queryRenderedFeatures(e.point,{ layers: trackLayers });
          map.getCanvas().style.cursor = features.length ? 'pointer' : '';
          if(features.length > 0){
            var data = features[0]["properties"]
            mapToolTip.style("display","block");
            mapToolTipGeo.html("<span>"+data.track_name+"</span><br>"+geoInfoMap.get(JSON.stringify(data.longitude)+JSON.stringify(data.latitude)).geo_name+" - "+formatNumber(data.views)+" views");
          }

          else{
            var featuresAdmin = map.queryRenderedFeatures(e.point,{ layers: ['admin-1-fill'] });
            if(featuresAdmin.length > 0){
              mapToolTip.style("display","block");
              var data = aOneMap.get(featuresAdmin[0]["properties"]["id"]);
              mapToolTipGeo.text(data["name"]+", "+aZeroMap.get(data["country_code"])["name"])
            }
            else if (countryFound){
              mapToolTip.style("display","block");
              mapToolTipGeo.text(aZeroMap.get(countryFound)["name"]);
            }
            else{
              mapToolTipGeo.text("");
              mapToolTip.style("display",null);
            }
          }

        });

      }

      var markerTimeout = false;


      function updateMapOnSongClick(){
        showToolTip();
        songSelectDiv.style("transform",null)
        songToolbarInfoTitle.text(function(d){
          if(songSelected.length > 15){
            return songSelected.slice(0,12)+"..."
          }
          return songSelected;
        });
        songToolbarInfoArtist.text(artistSelected);
        markerText.text("#1 in "+geoSelected+" - "+songSelected)
      }

      // map.on('click', function (e) {
      //   console.log("here");
      // });

      map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point,{ layers: ['medium-city-label-2','country-label','major-city-label-2','minor-city-label-2'] });
        if(features.length > 0 && markerTimeout == false){

          var trackData = features[0].properties;
          var trackLink = trackData.track_link.replace("https://www.youtube.com/watch?v=","");
          marker.setLngLat([trackData["longitude"],trackData["latitude"]])
          if(!mobile){
            playerElementWrapper.classed("player-fixed-moved",true);
          }

          songSelected = trackData.track_name;
          artistSelected = trackInfoMap.get(trackLink).artist_name;


          var concated = JSON.stringify(trackData["longitude"])+JSON.stringify(trackData["latitude"]);
          geoSelected = geoInfoMap.get(concated).geo_name;

          map.flyTo({center: [trackData["longitude"],trackData["latitude"]]});
          flying = true;

          map.once("moveend",function(d){
            if(!mobile){
              playerElementWrapper.classed("player-fixed-moved",true).style("top",marker["_pos"].y+"px").style("left",marker["_pos"].x+"px");
            }

            flying = false;
          })
          if(!mobile){
            player.loadVideoById(trackLink);
          }
          else{
            player.cueVideoById(trackLink)
          }

          updateMapOnSongClick();
        }
        else if (markerTimeout == false){

          var coors = e.lngLat;
          var featuresAdmin = map.queryRenderedFeatures(e.point,{ layers: ['admin-1-fill'] });
          if(featuresAdmin.length > 0){
            var data = featuresAdmin[0].properties;
            var trackName = adminOneSongMap.get(data.id).value;
            var trackData = trackInfoNameMap.get(trackName);
            var trackLink = trackData.track_link.replace("https://www.youtube.com/watch?v=","");

            marker.setLngLat([coors["lng"],coors["lat"]])
            songSelected = trackData.track_name;
            artistSelected = trackInfoMap.get(trackLink).artist_name;

            var geoData = aOneMap.get(data.id);

            geoSelected = geoData["name"];

            map.flyTo({center: [coors["lng"],coors["lat"]]});

            map.once("moveend",function(d){
              if(!mobile){
                playerElementWrapper.classed("player-fixed-moved",true).style("top",marker["_pos"].y+"px").style("left",marker["_pos"].x+"px");
              }

              flying = false;
            })

            if(!mobile){
              player.loadVideoById(trackLink);
            }
            else{
              player.cueVideoById(trackLink)
            }
            updateMapOnSongClick();
          }
        }
      });

      var marker = new mapboxgl.Marker(d3.select("#music-marker").node())
        .setLngLat([randomItem["longitude"],randomItem["latitude"]])
        .addTo(map);

      var doingShit = false;

      var markerElement = d3.select("#music-marker")

      markerElement.select("svg").on("click",function(d){
        markerTimeout = true;
        showToolTip();
        setTimeout(function(){
          markerTimeout = false;
        },500)
      })

      function showToolTip(){
        markerElement.select("#player").style("display",null);
        hideElement.style("display",null);
        markerText.style("display",null);
        playerElementWrapper.style("display",null);
        playerMenu.style("display",null);
      }

      function hideToolTip(){
        markerElement.select("#player").style("display","none");
        if(!mobile){
          hideElement.style("display","none");
        }

        // markerText.style("display","none");
      }

      var trackLink = randomItem.track_link.replace("https://www.youtube.com/watch?v=","");

      var playerElementWrapper = d3.select(".player-fixed");
      var playerElement = playerElementWrapper.append("iframe")
        .attr("id","player")
        .attr("src","https://www.youtube.com/embed/"+trackLink+"?enablejsapi=1&amp;enablejsapi=true&amp;playsinline=1&autoplay=0")
        .attr("frameborder","0")
        .property("allowfullscreen",true)
        ;

      var playerMenu = playerElementWrapper.append("div").attr("class","player-elements");

      var hideElement = playerMenu.append("div").attr("class","music-marker-close").text("×").on("click",function(d){
        markerTimeout = true;
        showToolTip();
        setTimeout(function(){
          markerTimeout = false;
        },500)
        hideToolTip();
        playerElementWrapper.classed("player-fixed-moved",false).style("top",null).style("left",null);
        if(mobile){
          playerElementWrapper.style("display","none");
          playerMenu.style("display","none");
        }
      })

      var markerText = playerMenu.append("div").attr("class","music-marker-text").text("#1 in ");

      var ytplayerWidth = "267";
      if(mobile){
        ytplayerWidth = "267";
      }

      player = new YT.Player('player', {
        height: '100%',
        width: ytplayerWidth,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        },
        enablejsapi: true,
        fs: 0,
        playsinline: 1
      });

      function filterLayersForSong(songForFunction){

        var trackLayers = ['country-label','major-city-label-2','minor-city-label-2','medium-city-label-2',"city-dots-2"];

        var removeLayersMap = {
          "country-label":countryFilter,
          "major-city-label-2":majorCityFilter,
          "minor-city-label-2":minorCityFilter,
          "medium-city-label-2":mediumCityFilter,
          "city-dots-2":null
        }

        for (var layer in trackLayers){
          if(songFiltered){

            if(removeLayersMap[trackLayers[layer]]){
              map.setFilter(
                trackLayers[layer],["all", removeLayersMap[trackLayers[layer]],["==","track_name",songForFunction]]
              );
            }
            else{
              map.setFilter(
                trackLayers[layer],["==","track_name",songForFunction]
              );
            }
          }
          else{
            map.setFilter(trackLayers[layer], removeLayersMap[trackLayers[layer]]);
          }
        }

        var fillLayers = ["admin-0-fill","admin-1-fill","postal-1-fill","admin-0-lines","admin-1-lines","postal-1-lines"];
        var fillLayersMap = {
          "admin-0-fill":topByCountry,
          "admin-1-fill":topByAdminOne,
          "postal-1-fill":topByPostalOne,
          "admin-0-lines":topByCountry,
          "admin-1-lines":topByAdminOne,
          "postal-1-lines":topByPostalOne,
        }
        for (var layer in fillLayers){
          if(songFiltered){
            var dataArray = fillLayersMap[fillLayers[layer]].filter(function(d){
                return d.value == songForFunction;
              }).map(function(d){
                return d.key;
              });
            map.setFilter(fillLayers[layer], ["in","id"].concat(dataArray));
          }
          else{
            map.setFilter(fillLayers[layer], null);
          }
        }
      }

      function keyupedsearch() {
        searchNewsroom(this.value.trim());
      }

      function searchNewsroom(value) {
        if (value.length > 2) {
          searchResults.style("display","block");

          searchResults.selectAll("p").remove();

          function escapeString(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          }
          //
          var re = new RegExp("\\b" + escapeString(value), "i");
          var searchArray = [];
          //
          searchArray = _.filter(geo_info, function(d,i) {
            return re.test(d.geo_name);
          })
          ;

          searchArray = searchArray.slice(0,5);

          searchResults
            .selectAll("p")
            .data(searchArray)
            .enter()
            .append("p")
            .attr("class","top-toolbar-search-box-results-result")
            .text(function(d){
              return d.geo_name + ", "+d.country_code;
            })
            .on("click",function(d){
              searchResults.style("display",null);

              var zoom = 8;

              if(d.geonameid == ""){
                zoom = 5;
              }
              map.flyTo({
                  center: [d.longitude,d.latitude],
                  zoom: zoom
                });
            })
            ;

          if(searchArray.length == 1){
          }

        }
        else{
          searchResults.style("display",null);
        }

      };

      function readyToGo(){
        allStarted = true;
        var trackLink = randomItem.track_link.replace("https://www.youtube.com/watch?v=","");

        var startButtonText = startButton.select(".start-button-play-text").text("Play #1 In "+randomItem.country_name);
        var startButtonSvg = startButton.select(".start-button-play-icon").style("display","block");

        map.flyTo({
            zoom: 6
          });

        startButton.style("pointer-events","all").on("click",function(d){

          // if(mobile){
          //   player.playVideo();
          // }

          map.flyTo({
              zoom: 3
            });

          map.once("moveend",function(d){
            if(!mobile){
              playerElementWrapper.classed("player-fixed-moved",true).style("top",marker["_pos"].y+"px").style("left",marker["_pos"].x+"px");
            }

            flying = false;
          })

          startModal
            .transition()
            .duration(500)
            .style("opacity",0)
            .on("end",function(d){
              startModal.style("display","none").remove();

              markerElement.select("#player").style("visibility","visible");
              hideElement.style("visibility","visible");
              markerText.style("visibility","visible");
              songSelectDiv.style("visibility","visible");
              toolbarTop.style("visibility","visible");
              mapToolTip.style("visibility","visible");

              showToolTip();
              if(!mobile){
                mapToolTip.style("display","block")
              }

              toolTipVisible = true;
              if(!mobile){
                player.loadVideoById(trackLink);
              }

              markerText.text("#1 in "+randomItem.country_name+" - "+randomItem.track_name)
              videoOnMap = true;

              songToolbarInfoTitle.text(function(d){
                if(randomItem.track_name.length > 15){
                  return randomItem.track_name.slice(0,12)+"..."
                }
                return randomItem.track_name;
              });
              songToolbarInfoArtist.text(randomItem.artist_name);

              songSelected = randomItem.track_name;
              artistSelected = randomItem.artist_name;
              geoSelected = randomItem.country_name;


            })

            var trackLayers = ['country-label','major-city-label-2','minor-city-label-2','medium-city-label-2'];
            for (var track in trackLayers){
              map.setLayoutProperty(trackLayers[track], 'visibility', 'visible');
            }
        });

      }


      function onPlayerReady(event) {

        searchInput.on("keyup", keyupedsearch);

        var trackLink = randomItem.track_link.replace("https://www.youtube.com/watch?v=","");
        if(!mobile){
          readyToGo();
        }
        songSelectDiv.on("click",function(d){
          var checked = d3.select(this).select(".song-filter-box").property("checked");
          if(!checked){
            d3.select(this).select(".song-filter-box").property("checked",true)
            songFiltered = true;
          }
          else{
            songFiltered = false;
            d3.select(this).select(".song-filter-box").property("checked",false)
          }
          filterLayersForSong(songSelected);
        });

        toolbarRightSong.on("click",function(d){
            var songSelect = d3.select(this).classed("right-song-selected");
            if(!songSelect){
              toolbarRightSong.classed("right-song-selected",false);
              songFiltered = true;
              d3.select(this).classed("right-song-selected",true);
              filterLayersForSong(d[0]);
              map.flyTo({
                  center: [1.873,18.301],
                  zoom: 1.2
                });

              songSelected = d3.select(this).datum()[0];
              artistSelected = trackInfoNameMap.get(d3.select(this).datum()[0]).artist_name;
              var track_link = trackInfoNameMap.get(d3.select(this).datum()[0]).track_link;
              if(track_link){
                player.loadVideoById(track_link);
              }
              songSelectDiv.style("transform",null)
              songToolbarInfoTitle.text(function(d){
                if(songSelected.length > 15){
                  return songSelected.slice(0,12)+"..."
                }
                return songSelected;
              });
              songToolbarInfoArtist.text(artistSelected);
              markerText.text("");

            }
            else {
              songFiltered = false;
              d3.select(this).classed("right-song-selected",false);
              filterLayersForSong(d[0]);
            }
          })
          ;

        volumeButton.on("click",function(d){
            var muted = d3.select(this).classed("muted");
            if(!muted){
              d3.select(this).classed("muted",true);
              player.mute();
            }
            else{
              d3.select(this).classed("muted",false);
              player.unMute();
            }
          })
        playPausePutton.classed("paused",true).on("click",function(d){
          var paused = d3.select(this).classed("paused")
          if(paused){
            d3.select(this).classed("paused",false);
            player.pauseVideo();
          }
          else{
            d3.select(this).classed("paused",true);
            player.playVideo();
          }
        })

        if(mobile){
          player.cueVideoById(trackLink);
        }
      }
      function onPlayerStateChange(event) {
        if(mobile && event.data == 5 && !allStarted){
          readyToGo();
        }
      }

    })



  }) //citydata
  })  //counntry data
  }) //a1 lookup
  }) //a0 lookup
  }) //track_info
  }) //geo_info
} //youtube api ready


export default { init, resize };
