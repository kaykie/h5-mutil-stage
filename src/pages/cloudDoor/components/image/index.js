import React, {Component} from 'react';


class Image extends Component {

  state = {
    imgsrc: '',
  };

  componentDidMount() {
    const src = this.props.source;
    const splitArray = src.split('@'), dpr = window.devicePixelRatio || 1,
      pre = splitArray[0], last = splitArray[1].split('.')[2];
    const imgSrc3x = pre + '@3x.' + last;
    const imgSrc2x = pre + '@2x.' + last;
    const imgSrc1x = splitArray[0] + '.' + splitArray[1].substr(1);
    let imgsrc = '';
    if (dpr > 2) {
      imgsrc = imgSrc3x;
    } else if (dpr === 1) {
      imgsrc = imgSrc1x;
    } else {
      imgsrc = imgSrc2x;
    }
    this.setState({
      imgsrc,
    });
  }

  render() {
    const {imgsrc} = this.state;
    return (
      <img src={imgsrc} {...this.props}/>
    );
  }
}


export default Image;
