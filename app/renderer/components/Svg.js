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
	activeFill: PropTypes.string,
	children: PropTypes.node,
	fill: PropTypes.string,
	hoverFill: PropTypes.string,
	onClick: PropTypes.func,
	size: PropTypes.string,
};

Svg.defaultProps = {
	fill: 'currentColor',
};

export default Svg;
