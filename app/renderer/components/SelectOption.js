import React from 'react';
import {classNames} from 'react-extras';
import Image from './Image';
import './SelectOption.scss';

const SelectOption = ({
	className,
	label,
	value,
	image,
	fallbackImage,
	imageRenderer,
	...props
}) => {
	if (typeof label !== 'string') {
		throw new TypeError('Prop `label` is required');
	}

	const hasImage = Boolean(image || imageRenderer);

	const containerClassName = classNames(
		'SelectOption',
		{
			'SelectOption--image': hasImage,
		},
		className
	);

	return (
		<div {...props} className={containerClassName}>
			{hasImage &&
				<span className="SelectOption__image-wrap">
					{imageRenderer ?
						imageRenderer({label, value}) :
						(
							<Image
								className="SelectOption__image"
								url={image}
								fallbackUrl={fallbackImage}
							/>
						)
					}
				</span>
			}
			<span className="SelectOption__label">
				{label}
			</span>
		</div>
	);
};

export default SelectOption;
