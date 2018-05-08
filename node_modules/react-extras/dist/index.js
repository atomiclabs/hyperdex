'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BodyClass = exports.RootClass = exports.For = exports.Choose = exports.If = exports.canUseDOM = exports.getDisplayName = exports.isStatelessComponent = exports.classNames = exports.autoBind = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _autoBind2 = require('./auto-bind');

var _autoBind3 = _interopRequireDefault(_autoBind2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-unused-vars */


var autoBind = exports.autoBind = _autoBind3.default.react;

var classNames = exports.classNames = function classNames() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var ret = new Set();

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;

			var type = typeof item === 'undefined' ? 'undefined' : _typeof(item);

			if (type === 'string' && item.length > 0) {
				ret.add(item);
			} else if (type === 'object' && item !== null) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Object.entries(item)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _ref = _step2.value;

						var _ref2 = _slicedToArray(_ref, 2);

						var key = _ref2[0];
						var value = _ref2[1];

						if (value) {
							ret.add(key);
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return [].concat(_toConsumableArray(ret)).join(' ');
};

var isStatelessComponent = exports.isStatelessComponent = function isStatelessComponent(Component) {
	return !(typeof Component.prototype !== 'undefined' && typeof Component.prototype.render === 'function');
};

var getDisplayName = exports.getDisplayName = function getDisplayName(Component) {
	return Component.displayName || Component.name || 'Component';
};

var canUseDOM = exports.canUseDOM = typeof window !== 'undefined' && 'document' in window && 'createElement' in window.document;

var If = exports.If = function If(props) {
	return props.condition ? props.render ? props.render() : props.children : null;
};
If.propTypes = {
	condition: _propTypes2.default.bool.isRequired,
	children: _propTypes2.default.node,
	render: _propTypes2.default.func
};

var Choose = exports.Choose = function Choose(props) {
	var when = null;
	var otherwise = null;

	_react2.default.Children.forEach(props.children, function (children) {
		if (children.props.condition === undefined) {
			otherwise = children;
		} else if (!when && children.props.condition === true) {
			when = children;
		}
	});

	return when || otherwise;
};
Choose.propTypes = {
	children: _propTypes2.default.node
};

Choose.When = If;

Choose.Otherwise = function (_ref3) {
	var render = _ref3.render,
	    children = _ref3.children;
	return render ? render() : children;
};
Choose.Otherwise.propTypes = {
	children: _propTypes2.default.node,
	render: _propTypes2.default.func
};

var For = exports.For = function For(_ref4) {
	var render = _ref4.render,
	    of = _ref4.of;
	return of.map(function (item, index) {
		return render(item, index);
	});
};
For.propTypes = {
	of: _propTypes2.default.array.isRequired,
	render: _propTypes2.default.func
};

var ElementClass = function (_React$PureComponent) {
	_inherits(ElementClass, _React$PureComponent);

	function ElementClass() {
		_classCallCheck(this, ElementClass);

		return _possibleConstructorReturn(this, (ElementClass.__proto__ || Object.getPrototypeOf(ElementClass)).apply(this, arguments));
	}

	_createClass(ElementClass, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _props = this.props,
			    add = _props.add,
			    remove = _props.remove;
			var classList = this.element.classList;


			if (add) {
				classList.add.apply(classList, _toConsumableArray(add.trim().split(' ')));
			}

			if (remove) {
				classList.remove.apply(classList, _toConsumableArray(remove.trim().split(' ')));
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var _props2 = this.props,
			    add = _props2.add,
			    remove = _props2.remove;
			var classList = this.element.classList;


			if (add) {
				classList.remove.apply(classList, _toConsumableArray(add.trim().split(' ')));
			}

			if (remove) {
				classList.add.apply(classList, _toConsumableArray(remove.trim().split(' ')));
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return ElementClass;
}(_react2.default.PureComponent);

ElementClass.propTypes = {
	add: _propTypes2.default.string,
	remove: _propTypes2.default.string
};

var RootClass = exports.RootClass = function (_ElementClass) {
	_inherits(RootClass, _ElementClass);

	function RootClass() {
		_classCallCheck(this, RootClass);

		var _this2 = _possibleConstructorReturn(this, (RootClass.__proto__ || Object.getPrototypeOf(RootClass)).call(this));

		_this2.element = document.documentElement;
		return _this2;
	}

	return RootClass;
}(ElementClass);

RootClass.propTypes = ElementClass.propTypes;

var BodyClass = exports.BodyClass = function (_ElementClass2) {
	_inherits(BodyClass, _ElementClass2);

	function BodyClass() {
		_classCallCheck(this, BodyClass);

		var _this3 = _possibleConstructorReturn(this, (BodyClass.__proto__ || Object.getPrototypeOf(BodyClass)).call(this));

		_this3.element = document.body;
		return _this3;
	}

	return BodyClass;
}(ElementClass);

BodyClass.propTypes = ElementClass.propTypes;