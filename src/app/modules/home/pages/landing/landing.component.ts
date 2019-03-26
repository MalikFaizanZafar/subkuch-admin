import { Component, HostBinding, OnInit } from '@angular/core';
import { IsRevealCarouselOptions } from '../../../../lib';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import {fromLonLat} from 'ol/proj.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import {Icon, Style, Text, Fill, Stroke} from 'ol/style';
// declare var proj: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @HostBinding() class: string = 'd-block';

  lat: number = 33.537268;
  lng: number = 73.118710;
  showLocationInput: boolean = false;
  slides: any = [
    {
      text: 0,
      img: 'https://1.bp.blogspot.com/-N2_ZY0dx9MA/W1ifneViZjI/AAAAAAABDS4/K-cY3362ZU4VvYvGS4CwJY2wV1V0frXngCLcBGAs/s1600/offer%2BRM5.50.jpg'
    },
    {
      text: 1,
      img: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/29/c4/71/the-most-selling-deal.jpg'
    },
    {
      text: 2,
      img: 'http://www.eatmedaily.com/wordpress/wp-content/uploads/2008/12/jumbo-deal.jpg'
    },
    {
      text: 3,
      img: 'https://www.pizzamax.com.pk/wp-content/uploads/2015/11/deal1.jpg'
    },
    {
      text: 4,
      img: 'http://options.pk/wp-content/uploads/2018/07/2.jpg'
    },
    {
      text: 5,
      img: 'http://options.pk/wp-content/uploads/2016/05/Deal-3-1.jpg'
    },
    {
      text: 6,
      img: 'http://options.pk/wp-content/uploads/2016/05/fds.jpg'
    },
    {
      text: 7,
      img: 'https://i.pinimg.com/originals/da/49/61/da49618531efd8ce5e7b43fd2dd35dfa.png'
    },
    {
      text: 8,
      img: 'http://www.deals.com.pk/wp-content/uploads/2015/06/FatBurger-Pakistan-Iftar-Deals-2015.jpg'
    },
    {
      text: 9,
      img: 'https://dunkendine.com/wp-content/uploads/2017/12/01-WoW-Meal-Deal.jpeg'
    }
  ];
  
  OptionsWithoutBottomNav: IsRevealCarouselOptions = {
    numVisibleItems: 5,
    paging: false
  };

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  marker: Feature;
  marker2: Feature;
  vectorSource: OlVectorSource;
  vectorLayer: OlVectorLayer;

  ngOnInit() {
    this.marker = new Feature({
        type: 'icon',
        geometry: new Point(fromLonLat([73.000784,33.671287])),
        
        // labelPoint: new Point(fromLonLat([73.000784,33.671287])),
        // name: 'My Polygon'
    }); 
    this.marker.set('description', 'G11-Markaz Morh')
    // 33.672263, 72.997570  33.671287, 73.000784
    //33.672035, 73.002536  33.675489, 72.998381
    // this.marker.setGeometryName('labelPoint');
    this.marker.setStyle(new Style({
      image: new Icon(({
        color: '#ff0000',
        crossOrigin: 'anonymous',
        src: 'assets/loc.png',
        // src: 'https://cdn0.iconfinder.com/data/icons/tiny-icons-1/100/tiny-08-512.png',
        imgSize: [50,50],
        text: new Text({
          font: '22px',
          offsetX: -20,
          offsetY: 20,
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#fff', width: 2
          }),
          // get the text from the feature - `this` is ol.Feature
          text: 'G11 Markaz'
        })
      }))
    }))

    this.marker2 = new Feature({
      type: 'icon',
      geometry: new Point(fromLonLat([73.002536,33.672035]))
  }); 
  // 33.672263, 72.997570  33.671287, 73.000784
  //33.672035, 73.002536  33.675489, 72.998381

  this.marker2.setStyle(new Style({
    image: new Icon(({
      color: '#ff0000',
      crossOrigin: 'anonymous',
      src: 'assets/loc.png',
      // src: 'https://cdn0.iconfinder.com/data/icons/tiny-icons-1/100/tiny-08-512.png',
      imgSize: [50,50]
    }))
  }))
    this.vectorSource = new OlVectorSource({
          features: [this.marker, this.marker2]
      });

      this.vectorLayer = new OlVectorLayer({
          source: this.vectorSource
      });
    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
  });

    this.layer = new OlTileLayer({
      source: this.source
    });
    this.view = new OlView({
      center: fromLonLat([72.9912728, 33.6746233]),   //33.6746233,72.9912728
      zoom: 16
    });
    this.map = new OlMap({
      target: 'map',
      layers: [this.layer, this.vectorLayer],
      view: this.view
    });
  }
}
