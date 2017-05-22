const MPValidate = {};
export default MPValidate;

MPValidate.install = function (Vue, options = {}) {

	Object.assign(validators, options.validators);
	Object.assign(validatorsError, options.validatorsError);

	let elements = [];

	let errorDiv = options.errorDiv || 'm-form_error';
	let errorClass = options.errorClass || 'is-error';
	let successClass = options.successClass || 'is-success';
	let inputParentClass = options.inputParentClass || '.m-form_item';
	let attrInputName = options.attrInputName || 'placeholder'

	let parent = (el, selector) => {
		while ((el = el.parentElement) && !el.matches(selector));
		return el;
	};

	let createErrorEl = (parent) => {
		let element = document.createElement("span");
		element.className = errorDiv;
		return parent.appendChild(element);
	}

	let validateField = (el, filters) => {

		let item = parent(el, inputParentClass);
		let errorEl = item.querySelector(`.${errorDiv}`) || createErrorEl(item);

		for(let [key, param] of Object.entries(filters)) {
			if(validators[key] && validators[key](el.value, param) == false) {

				let msg = (validatorsError[key] || validatorsError['default'])
							.replace(/%name%/g, el.getAttribute(attrInputName))
							.replace(/%param%/g, param);

				errorEl.innerHTML = msg;
				item.classList.remove(successClass);
				item.classList.add(errorClass);

				return false;
			}
		}

		errorEl.remove();
		item.classList.remove(errorClass);
		item.classList.add(successClass);

		return true;
	}

	Vue.prototype.$validate = function (formId) {

		let canSubmit = true;

		for (let field of elements) {
			if(parent(field.elm, formId) !== null) {

				let binding = field.data.directives.filter((value) => {
					return value.name === 'validate';
				})[0];

				let filters = Object.assign({}, binding.modifiers, binding.value);

				if(!validateField(field.elm, filters))
					canSubmit =	 false;

			}
		}

		return canSubmit;
	}

	Vue.directive('validate', {
		inserted: function(el, binding, vnode) {

			elements.push(vnode);
			let filters = Object.assign({}, binding.modifiers, binding.value);

			el.addEventListener('blur', () => validateField(el, filters));
		}
	});

};

let validators = {
	required: function(value) {
		return Boolean(value.trim().length);
	},
	string: function(value) {
		return /^[A-Za-z ]+$/.test(value);
	},
	number: function(value) {
		return /^\d+$/.test(value);
	},
	email: function(value) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(value);
	},
	minlength: function(value, param) {
		return (value.trim().length >= param);
	},
	maxlength: function(value, param) {
		return (value.trim().length <= param);
	}
}

let validatorsError = {
	default: 'Błędna wartośc pola %name%',
	required: `Pole %name% jest wymagane`,
	string: 'Pole %name% może zawierac tylko znaki A-Z i spacje',
	number: 'Pole %name% może zawierac tylko liczby',
	email: 'Błędny adres e-mail',
	minlength: 'Minimalna liczba znaków dla pola %name% to %param%',
	maxlength: 'Dozwolona liczba znaków dla pola %name% to %param%'
}
