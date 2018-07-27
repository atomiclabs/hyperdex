import React from 'react';
import PropTypes from 'prop-types';

const Image = ({url, fallbackUrl, ...props}) => (
	<img
		{...props}
		src={url}
		onError={event => {
			const element = event.currentTarget;

			if (fallbackUrl) {
				element.src = fallbackUrl;
			} else {
				element.style.visibility = 'hidden';
			}
		}}
	/>
);

Image.propTypes = {
	fallbackUrl: PropTypes.string,
	url: PropTypes.string,
};

export default Image;
