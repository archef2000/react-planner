import React, { Component } from 'react';
import { Models, ReactPlannerContext } from '@archef2000/react-planner';

const grabCircleRadius = 10;
const hoverCircleRadius = 14;
const rulerColor = '#f45c42';
const hoverColor = '#ff9900';

const grabCircleStyle = {
  cursor: 'grab',
  fill: rulerColor,
  transition: 'r 150ms ease-in'
};

const hoverCircleStyle = {
  cursor: 'grab',
  fill: hoverColor,
  transition: 'r 150ms ease-in'
};

const pointsDistance = (x1, y1, x2, y2) => {

  if (
    !isNaN(x1) &&
    !isNaN(y1) &&
    !isNaN(x2) &&
    !isNaN(y2)
  ) {
    if (!(x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0)) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
  }

  return 0;
};

interface ImageFulProps {
  element: any;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  distance: any;
  width: number;
  height: number;
  imageUri: string;
  layer: Models.Layer;
  scene: Models.Scene;
}

interface ImageFulState {
  handleMouseMove1: boolean;
  handleMouseMove2: boolean;
  hover1: boolean;
  hover2: boolean;
  imageLoadError: boolean;
}

export default class ImageFul extends Component<ImageFulProps, ImageFulState> {
  static contextType = ReactPlannerContext;
  declare context: React.ContextType<typeof ReactPlannerContext>;

  constructor(props: ImageFulProps) {
    super(props);

    this.state = {
      handleMouseMove1: false,
      handleMouseMove2: false,
      hover1: false,
      hover2: false,
      imageLoadError: false
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.toggleHover1 = this.toggleHover1.bind(this);
    this.toggleHover2 = this.toggleHover2.bind(this);
  }

  onMouseDown(event) {
    const target = event.viewerEvent.originalEvent.target;

    if (target.nodeName === 'circle') {
      if (target.attributes.name) {
        if (target.attributes.name.nodeValue === 'fst-anchor') {
          this.setState({ handleMouseMove1: !this.state.handleMouseMove1 });
        }
        else if (target.attributes.name.nodeValue === 'snd-anchor') {
          this.setState({ handleMouseMove2: !this.state.handleMouseMove2 });
        }
      }
    }
  }

  onMouseMove(event) {
    let { x, y } = event.viewerEvent;

    y = this.props.scene.height - y;

    const dist = pointsDistance(this.props.x1, this.props.y1, this.props.x2, this.props.y2);
    const scale = !isNaN(dist) && dist ? (this.props.distance.length / dist) : 0;

    const origin = {
      x: this.props.element.x - (this.props.width * scale / 2),
      y: this.props.element.y + (this.props.height * scale / 2)
    };

    const minX = origin.x + (this.props.width * scale);
    const minY = origin.y - (this.props.height * scale);

    if (x < origin.x) {
      x = origin.x;
    }
    else if (x > minX) {
      x = minX;
    }

    if (y > origin.y) {
      y = origin.y;
    }
    else if (y < minY) {
      y = minY;
    }

    const newX = (x - origin.x);
    const newY = (origin.y - y);

    if (this.state.handleMouseMove1) {
      const dist = pointsDistance(newX, newY, this.props.x2, this.props.y2);
      this.context.projectActions.setProperties({ x1: newX, y1: newY, distance: { length: dist } });
    }
    else if (this.state.handleMouseMove2) {
      const dist = pointsDistance(this.props.x1, this.props.y1, newX, newY);
      this.context.projectActions.setProperties({ x2: newX, y2: newY, distance: { length: dist } });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown-planner-event', this.onMouseDown);
    document.addEventListener('mousemove-planner-event', this.onMouseMove);

    if (this.props.imageUri) {
      const img = new Image;
      img.src = this.props.imageUri;
      img.onload = () => {
        this.setState({ imageLoadError: false });
        this.context.projectActions.setProperties({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        this.setState({ imageLoadError: true })
      };
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown-planner-event', this.onMouseDown);
    document.removeEventListener('mousemove-planner-event', this.onMouseMove);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageUri !== this.props.imageUri) {
      const img = new Image;
      img.src = this.props.imageUri;
      img.onload = () => {
        this.setState({ imageLoadError: false });
        this.context.projectActions.setProperties({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        this.setState({ imageLoadError: true })
      };
    }
  }

  toggleHover1(e) {
    this.setState({ hover1: !this.state.hover1 })
  }

  toggleHover2(e) {
    this.setState({ hover2: !this.state.hover2 })
  }

  render() {
    const dist = pointsDistance(this.props.x1, this.props.y1, this.props.x2, this.props.y2);
    const scale = !isNaN(dist) && dist ? (this.props.distance.length / dist) : 0;
    const half_w = this.props.width / 2;

    const ruler = !this.props.element.selected ? null : (
      <g>
        <line key="1" x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} stroke={rulerColor}
          strokeWidth="3px" />
        <circle
          onMouseEnter={this.toggleHover1}
          onMouseLeave={this.toggleHover1}
          key="2"
          name="fst-anchor"
          cx={this.props.x1}
          cy={this.props.y1}
          r={this.state.hover1 || this.state.handleMouseMove1 ? hoverCircleRadius : grabCircleRadius}
          style={this.state.hover1 || this.state.handleMouseMove1 ? hoverCircleStyle : grabCircleStyle} />
        <circle
          onMouseEnter={this.toggleHover2}
          onMouseLeave={this.toggleHover2}
          key="3"
          name="snd-anchor"
          cx={this.props.x2}
          cy={this.props.y2}
          r={this.state.hover2 || this.state.handleMouseMove2 ? hoverCircleRadius : grabCircleRadius}
          style={this.state.hover2 || this.state.handleMouseMove2 ? hoverCircleStyle : grabCircleStyle} />
      </g>
    );

    return (
      <g
        transform={`scale(${scale}, ${scale}), scale(1,-1) translate(${-this.props.width / 2}, ${-this.props.height / 2})`}>
        {
          this.props.imageUri && !this.state.imageLoadError ?
            <image
              xlinkHref={this.props.imageUri}
              x="0"
              y="0"
              width={this.props.width}
              height={this.props.height}
            /> :
            <g>
              <rect x="0" y="0" width={this.props.width} height={this.props.height} fill="#CCC"></rect>
              <text
                x={half_w}
                y={this.props.height / 2}
                textAnchor="middle"
                alignmentBaseline="central"
                fontFamily="Arial"
                fontSize="35"
                fill="#666"
              >
                <tspan x={half_w} dy="-2em">Set the image url on the component</tspan>
                <tspan x={half_w} dy="1em">property inside the sidebar,</tspan>
                <tspan x={half_w} dy="1em">click and move each vertex</tspan>
                <tspan x={half_w} dy="1em">of the ruler then set the real distance</tspan>
                <tspan x={half_w} dy="1em">in the component property</tspan>
              </text>
            </g>
        }
        {ruler}
      </g>
    )
  }
}
