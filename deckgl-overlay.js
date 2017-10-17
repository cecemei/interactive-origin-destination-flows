import React, {Component} from 'react';
import {scaleQuantile} from 'd3-scale';

import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';

export const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132]
];

export const outFlowColors = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
  [227, 26, 28],
  [177, 0, 38]
];

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      longitude: -81.3850981383551,
      latitude: 28.50974776747675,
      zoom: 11,
      maxZoom: 15,
      pitch: 30,
      bearing: 30
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      arcs: this._getArcs(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data ||
        nextProps.selectedFeature !== this.props.selectedFeature) {
      this.setState({
        arcs: this._getArcs(nextProps)
      });
    }
    window.data =nextProps.data;
  }

  _getArcs({data, selectedFeature}) {
    if (!data || !selectedFeature) {
      return null;
    }

    const {flows, centroid} = selectedFeature.properties;

    window.flows=flows;
    let flows_dict = {};
    var t = flows.split(',');
    for (var i in t){
        i = t[i].split(':');
        flows_dict[i[0]] = parseInt(i[1]);
    }
    
    window.flows_dict =flows_dict;
    const arcs = Object.keys(flows_dict).map(toId => {
      const f = data[toId];
      
     
      return {
        source: centroid,
        target: f.properties.centroid,
        value: flows_dict[toId]
      };
    });

    const scale = scaleQuantile()
      .domain(arcs.map(a => Math.abs(a.value)))
      .range(inFlowColors.map((c, i) => i));

    arcs.forEach(a => {
      a.gain = Math.sign(a.value);
      a.quantile = scale(Math.abs(a.value));
    });
    window.arcs=arcs;
    return arcs;
  }

  render() {
    const {viewport, strokeWidth, data} = this.props;
    const {arcs} = this.state;

    if (!arcs) {
      return null;
    }

    var layers = [
      new GeoJsonLayer({
        id: 'geojson',
        data,
        stroked: false,
        filled: true,
        getFillColor: (d) =>   [Math.random()*255, Math.random()*255, Math.random()*255,150],//[0, 0, 0, 0],
        onHover: this.props.onHover,
        onClick: this.props.onClick,
        pickable: Boolean(this.props.onHover || this.props.onClick)
      })];
      
    var arcs1=[]; var arcs2=[]; var arcs3=[];
    for(let i=0;i<arcs.length;i++){
        if(arcs[i].quantile>=5)
            arcs3.push(arcs[i])
        else if(arcs[i].quantile>=3)
            arcs2.push(arcs[i])
        else
            arcs1.push(arcs[i])
    }        
      
      layers[1] = new ArcLayer({
        id: 'arc1',
        data: arcs1,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getSourceColor: d => inFlowColors[d.quantile],
        getTargetColor: d => outFlowColors[d.quantile],
        strokeWidth: 2
      })
      
      layers[2] = new ArcLayer({
        id: 'arc2',
        data: arcs2,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getSourceColor: d => inFlowColors[d.quantile],
        getTargetColor: d => outFlowColors[d.quantile],
        strokeWidth: 4
      })
      
      layers[3] = new ArcLayer({
        id: 'arc3',
        data: arcs3,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getSourceColor: d => inFlowColors[d.quantile],
        getTargetColor: d => outFlowColors[d.quantile],
        strokeWidth: 8
      })
    ;

    return (
      <DeckGL {...viewport} layers={ layers } initWebGLParameters />
    );
  }
}
