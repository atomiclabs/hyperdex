import React from 'react';

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

export default Image;
