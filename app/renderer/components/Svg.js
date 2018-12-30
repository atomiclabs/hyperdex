import React from 'react';
import PropTypes from 'prop-types';

const Svg = ({
	size,
	fill,
	hoverFill,
	activeFill,
	children,
	...props
}) => (
	<svg {...props}>
		{children}
		<style jsx>
			{`
				svg {
					width: ${size};
					height: ${size};
					fill: ${fill};
				}

				svg:hover {
					fill: ${hoverFill};
				}

				.active,
				.active:hover {
					fill: ${activeFill};
				}
			`}
		</style>
	</svg>
);

Svg.propTypes = {
	children: PropTypes.node.isRequired,
	size: PropTypes.string,
	fill: PropTypes.string,
	hoverFill: PropTypes.string,
	activeFill: PropTypes.string,
	onClick: PropTypes.func,
};

Svg.defaultProps = {
	size: undefined,
	fill: 'currentColor',
	hoverFill: undefined,
	activeFill: undefined,
	onClick: undefined,
};

export default Svg;
