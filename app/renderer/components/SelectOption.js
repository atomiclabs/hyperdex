import React from 'react';
import PropTypes from 'prop-types';
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

SelectOption.propTypes = {
	className: PropTypes.string,
	fallbackImage: PropTypes.string,
	image: PropTypes.string,
	imageRenderer: PropTypes.func,
	label: PropTypes.string,
	value: PropTypes.string,
};

export default SelectOption;
