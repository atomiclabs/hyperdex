import React from 'react';

const Spinner = ({
	color = '#7f8fa4',
	size = 40,
	...props
}) => (
	<svg
		{...props}
		width={size}
		height={size}
		viewBox="0 0 50 50"
	>
		<path
			fill={color}
			d="M25.25 6.46A18.68 18.68 0 0 0 6.57 25.14h4.07a14.6 14.6 0 0 1 14.61-14.61V6.46z"
		>
			<animateTransform
				attributeType="xml"
				attributeName="transform"
				type="rotate"
				from="0 25 25"
				to="360 25 25"
				dur="0.6s"
				repeatCount="indefinite"
			/>
		</path>
	</svg>
);

export default Spinner;
