import React from 'react';
import {classNames} from 'react-extras';
import './SelectOption.scss';

const SelectOption = ({className, label, image, fallbackImage, ...props}) => {
	if (typeof label !== 'string') {
		throw new TypeError('Prop `label` is required');
	}

	const containerClassName = classNames(
		'SelectOption',
		{
			'SelectOption--image': image,
		},
		className
	);

	return (
		<div {...props} className={containerClassName}>
			{image &&
				<span className="SelectOption__image-wrap">
					<img
						className="SelectOption__image"
						src={image}
						onError={event => {
							const element = event.currentTarget;

							if (fallbackImage) {
								element.src = fallbackImage;
							} else {
								element.style.visibility = 'hidden';
							}
						}}
					/>
				</span>
			}
			<span className="SelectOption__label">
				{label}
			</span>
		</div>
	);
};

export default SelectOption;
