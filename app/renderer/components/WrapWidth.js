/* eslint-disable react/no-string-refs */
import React from 'react';
import _ from 'lodash';

function getTextWidth(text, options) {
	options = Object.assign({}, options);

	if (options.font && options.element) {
		throw new TypeError('The `font` and `element` options are mutually exclusive');
	}

	if (options.element) {
		options.font = window.getComputedStyle(options.element).font;
	}

	const context = document.createElement('canvas').getContext('2d');
	context.font = options.font;
	return context.measureText(text).width;
}

class WrapWidth extends React.Component {
	state = {};

	recalculate() {
		const words = this.props.children.split(' ');
		const chunks = _.chunk(words, this.props.wordsPerLine);

		const widths = [];
		for (const chunk of chunks) {
			const width = getTextWidth(chunk.join(' '), {element: this.refs.container});
			widths.push(width);
		}

		this.setState({
			width: Math.max(...widths),
		});
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.children !== prevProps.children ||
			this.props.wordsPerLine !== prevProps.wordsPerLine
		) {
			this.recalculate();
		}
	}

	componentDidMount() {
		this.recalculate();
	}

	render() {
		const THRESHOLD = 1; // Just to be safe
		const style = this.state.width ? {width: this.state.width + THRESHOLD} : {};

		return (
			<div ref="container" className={this.props.className} style={style}>
				{this.props.children}
			</div>
		);
	}
}

export default WrapWidth;
