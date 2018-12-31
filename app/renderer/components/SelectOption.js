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
	label: PropTypes.string.isRequired,
	value: PropTypes.string,
	image: PropTypes.string,
	fallbackImage: PropTypes.string,
	imageRenderer: PropTypes.func,
};

SelectOption.defaultProps = {
	className: '',
	value: '',
	image: undefined,
	fallbackImage: undefined,
	imageRenderer: undefined,
};

export default SelectOption;
