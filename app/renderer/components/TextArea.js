import React from 'react';
import {classNames} from 'react-extras';
import './TextArea.scss';

class TextArea extends React.Component {
	state = {
		value: this.props.value,
	};

	handleChange = event => {
		const {target} = event;
		const {value} = target;
		const {onChange, preventNewlines} = this.props;

		if (preventNewlines && /\r?\n/.test(value)) {
			const form = target.closest('form');
			if (form) {
				form.dispatchEvent(new Event('submit'));
			}

			return;
		}

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
			preventNewlines,
			...props
		} = this.props;

		if (errorMessage) {
			level = 'error';
			message = errorMessage;
		}

		const containerClassName = classNames(
			'TextArea',
			'Input',
			{
				[`Input--${level}`]: level,
				'Input--disabled': disabled,
			},
			className
		);

		return (
			<div className={containerClassName}>
				<div className="Input-wrap">
					<textarea
						{...props}
						ref={forwardedRef}
						value={this.state.value}
						disabled={disabled}
						onChange={this.handleChange}
					/>
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
	<TextArea {...props} forwardedRef={ref}/>
));
