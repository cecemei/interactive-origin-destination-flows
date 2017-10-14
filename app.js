/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';
import * as d3 from 'd3';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json'; // eslint-disable-line
const florida = './florida.json';

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null,
      selectedCounty: null
    };
    d3.json(florida, (error, response) => {
        if(!error){
            window.feature = response.features;
            this.setState({
              data: response.features,
              selectedCounty: response.features.find(f => f.properties.name === 1)
            });
        }
    });
 
    /*requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({
          data: response.features,
          selectedCounty: response.features.find(f => f.properties.name === '1')//'Los Angeles, CA')
        });
      }
      console.log(JSON.stringify(this.state.data));
    });*/
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onHover(info) {
    // Hovered over a county
  }

  _onClick(info) {
    // Clicked a county
    window.info = info;
    //console.log(info.object);
    this.setState({selectedCounty: info.object});
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, data, selectedCounty} = this.state;
    window.state=this.state;
    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          selectedFeature={selectedCounty}
          onHover={this._onHover.bind(this)}
          onClick={this._onClick.bind(this)}
          strokeWidth={2}
          />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));