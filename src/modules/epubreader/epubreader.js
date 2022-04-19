import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { useSwipeable } from 'react-swipeable'
import { EpubView } from '..'
import defaultStyles from './style'
import {Button, Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';
import homeicon from '../../assets/homeicon.png'
import quizicon from '../../assets/quizicon.png'

// src/assets/homeicon.png
// src/modules/epubreader/epubreader.js

const Swipeable = ({ children, ...props }) => {
  const handlers = useSwipeable(props)
  return <div {...handlers}>{children}</div>
}

class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href)
  }
  render() {
    const { label, styles } = this.props
    return (
      <button onClick={this.setLocation} style={styles}>
        {label}
      </button>
    )
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
}

class EBookReader extends PureComponent {
  constructor(props) {
    super(props)
    this.readerRef = React.createRef()
    this.state = {
      expandedToc: false,
      toc: false,
      pageNum: 1
    }
  }
  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc
    })
  }

  next = () => {
    this.setState({
      pageNum: this.state.pageNum + 1
    })
    const node = this.readerRef.current
    node.nextPage()
  }

  prev = () => {
    console.log(this.props.pageNum)
    this.setState({
      pageNum: this.state.pageNum + 1
    })
    const node = this.readerRef.current
    node.prevPage()
  }

  onTocChange = toc => {
    const { tocChanged } = this.props
    this.setState(
      {
        toc: toc
      },
      () => tocChanged && tocChanged(toc)
    )
  }

  renderToc() {
    const { toc, expandedToc } = this.state
    const { styles } = this.props
    return (
      <div>
        <div style={styles.tocArea}>
          <div style={styles.toc}>
            <Button component={Link} to="/react-reader" style={styles.homeButton}>
              <img src={homeicon} width="40" height="40" ></img>
            </Button>
          </div>
          <div style={styles.toc}>
            <Button style={styles.quizButton}>
              <img src={quizicon} width="40" height="40" ></img>
            </Button>
          </div>
        </div>
        {expandedToc && (
          <div style={styles.tocBackground} onClick={this.toggleToc} />
        )}
      </div>
    )
  }

  setLocation = loc => {
    const { locationChanged } = this.props
    this.setState(
      {
        expandedToc: false
      },
      () => locationChanged && locationChanged(loc)
    )
  }

  renderTocToggle() {
    const { expandedToc } = this.state
    const { styles } = this.props
    return (
      <button
        style={Object.assign(
          {},
          styles.tocButton,
          expandedToc ? styles.tocButtonExpanded : {}
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)}
        />
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)}
        />
      </button>
    )
  }

  render() {
    const {
      title,
      showToc,
      loadingView,
      styles,
      locationChanged,
      swipeable,
      epubViewStyles,
      ...props
    } = this.props
    const { toc, expandedToc } = this.state
    return (
      <div style={styles.container}>
        <div
          style={Object.assign(
            {},
            styles.readerArea,
            expandedToc ? styles.containerExpanded : {}
          )}
        >
          {showToc && this.renderTocToggle()}
          <div style={styles.titleArea}>{title}</div>
          
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
          >
            <div style={styles.reader}>
              <EpubView
                ref={this.readerRef}
                loadingView={loadingView}
                styles={epubViewStyles}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={styles.swipeWrapper} />}
            </div>
          </Swipeable>
          <button
            style={Object.assign({}, styles.arrow, styles.prev)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, styles.arrow, styles.next)}
            onClick={this.next}
          >
            ›
          </button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    )
  }
}

EBookReader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles
}

EBookReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  showToc: PropTypes.bool,
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubViewStyles: PropTypes.object,
  swipeable: PropTypes.bool
}

export default EBookReader
