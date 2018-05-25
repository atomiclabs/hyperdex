import React from 'react';
import {classNames} from 'react-extras';
import './Input.scss';

class Input extends React.Component {
	state = {
		value: this.props.value,
	};

	handleChange = event => {
		const {value} = event.target;
		const {onChange} = this.props;

		if (onChange) {
			event.persist();
		}

		this.setState({value}, () => {
			if (onChange) {
				onChange(value, event);
			}
		});
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.state.value) {
			this.setState({value: nextProps.value});
		}
	}

	render() {
		let {
			forwardedRef,
			className,
			level,
			message,
			errorMessage,
			disabled,
			readOnly,
			onChange,
			type = 'text',
			icon,
			iconSize,
			iconName,
			view: View,
			button: Button,
			...props
		} = this.props;

		if (errorMessage) {
			level = 'error';
			message = errorMessage;
		}

		if (type === 'password') {
			iconName = 'password';
		}

		if (iconName) {
			icon = `/assets/${iconName}-icon.svg`;
		}

		const containerClassName = classNames(
			'Input',
			{
				[`Input--${level}`]: level,
				'Input--disabled': disabled,
				'Input--readonly': readOnly,
				'Input--icon': icon,
				'Input--view': View || Button,
			},
			className
		);

		return (
			<div className={containerClassName}>
				<div className="Input-wrap">
					<input
						{...props}
						ref={forwardedRef}
						value={this.state.value}
						type={type}
						disabled={disabled}
						readOnly={readOnly}
						onChange={this.handleChange}
					/>
					{icon &&
						<span className="Input__icon">
							<img src={icon} width={iconSize}/>
						</span>
					}
					{View &&
						<span className="Input__view">
							<View/>
						</span>
					}
					{Button &&
						<span className="Input__view Input__button">
							<Button/>
						</span>
					}
				</div>
				{((level && message) || message) &&
					<span className="Input__text">
						<p>{message}</p>
					</span>
				}
			</div>
		);
	}
}

export default React.forwardRef((props, ref) => (
	<Input {...props} forwardedRef={ref}/>
));
