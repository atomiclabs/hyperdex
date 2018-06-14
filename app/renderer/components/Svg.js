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

Svg.defaultProps = {
	fill: 'currentColor',
};

Svg.propTypes = {
	size: PropTypes.string,
	fill: PropTypes.string,
	hoverFill: PropTypes.string,
	activeFill: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node,
};

export default Svg;
