const MPValidate = {};
export default MPValidate;

MPValidate.install = (Vue, options = {}) => {

	Object.assign(validators, options.validators);
	Object.assign(validatorsError, options.validatorsError);

	let elements = [];

	const errorDiv = options.errorDiv || 'm-form_error';
	const errorClass = options.errorClass || 'is-error';
	const successClass = options.successClass || 'is-success';
	const inputParentClass = options.inputParentClass || '.m-form_item';
	const attrInputName = options.attrInputName || 'placeholder'

	const parent = (el, selector) => {
		while ((el = el.parentElement) && !el.matches(selector));
		return el;
	};

	const createErrorEl = (parent) => {
		const element = document.createElement("span");
		element.className = errorDiv;
		return parent.appendChild(element);
	}

	const validateField = (el, filters) => {

		const item = parent(el, inputParentClass);
		const errorEl = item.querySelector(`.${errorDiv}`) || createErrorEl(item);

		for(const [key, param] of Object.entries(filters)) {
			if(validators[key] && validators[key](el.value, param) == false) {

				const msg = (validatorsError[key] || validatorsError['default'])
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

	Vue.prototype.$validate = (formId) => {

		let canSubmit = true;

		for (const field of elements) {
			if(parent(field.elm, formId) !== null) {

				const binding = field.data.directives.filter((value) => {
					return value.name === 'validate';
				})[0];

				const filters = Object.assign({}, binding.modifiers, binding.value);

				if(!validateField(field.elm, filters))
					canSubmit =	 false;

			}
		}

		return canSubmit;
	}

	Vue.directive('validate', {
		inserted: (el, binding, vnode) => {

			elements.push(vnode);
			const filters = Object.assign({}, binding.modifiers, binding.value);

			el.addEventListener('blur', () => validateField(el, filters));
		}
	});

};

let validators = {
	number: (value) => /^\d+$/.test(value),
	string: (value) => /^[A-Za-z ]+$/.test(value),
	required: (value) => Boolean(value.trim().length),
	minlength: (value, param) => (value.trim().length >= param),
	maxlength: (value, param) => (value.trim().length <= param),
	email: (value) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(value);
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
