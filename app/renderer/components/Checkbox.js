import React from 'react';
import {classNames} from 'react-extras';
import './Checkbox.scss';

class Checkbox extends React.Component {
	state = {
		checked: Boolean(this.props.checked),
	};

	render() {
		const {
			className,
			checked,
			disabled,
			label,
			value,
			onChange,
			innerRef,
			...props
		} = this.props;

		const containerClassName = classNames(
			'Checkbox',
			{
				'Checkbox--checked': checked,
				'Checkbox--disabled': disabled,
			},
			className
		);

		return (
			<div className={containerClassName}>
				<label>
					<input
						{...props}
						ref={innerRef}
						type="checkbox"
						value={value}
						checked={this.state.checked}
						disabled={disabled}
						onChange={event => {
							this.setState(prevState => {
								const checked = !prevState.checked;

								if (onChange) {
									onChange(checked, event);
								}

								return {checked};
							});
						}}
					/>
					<span className="Checkbox__bullet">
						{this.state.checked &&
							<svg className="checkmark-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path fill="currentColor" d="M4.5 8.09L2.42 6l-.71.7L4.5 9.5l6-6-.7-.7z"/></svg>
						}
					</span>
					<span className="Checkbox__label">{label}</span>
				</label>
			</div>
		);
	}
}

export default Checkbox;
