/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';


import * as d3 from 'd3';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
const florida = './data/florida.json';

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
      selectedZone: null
    };
    d3.json(florida, (error, response) => {
        if(!error){
            window.feature = response.features;
            this.setState({
              data: response.features,
              selectedZone: response.features.find(f => f.properties.name === 6994)
            });
        }
    });

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
    // Hovered over a zone
  }

  _onClick(info) {
    // Clicked a zone
    window.info = info;
    //console.log(info.object);
    this.setState({selectedZone: info.object});
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, data, selectedZone} = this.state;
    window.state=this.state;
    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          selectedFeature={selectedZone}
          onHover={this._onHover.bind(this)}
          onClick={this._onClick.bind(this)}
          strokeWidth={2}
          />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
