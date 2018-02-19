import React from 'react';
import {classNames} from 'react-extras';

const SelectOption = ({className, label, image, ...props}) => {
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
			<span className="SelectOption__label">
				{label}
			</span>
			{image &&
				<span className="SelectOption__image-wrap">
					<img src={image}/>
				</span>
			}
		</div>
	);
};

export default SelectOption;
