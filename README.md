![Exaple](http://michalpb1.pl/Demo/mpvalidate.png)

### Installation

Import plugin to your project e.g

```js
import MPValidate from './src/validation.js'
```
### Configuration
```js
Vue.use(MPValidate, [options]);
```

### Options
| Plugin | README |
| ------ | ------ |
| errorDiv | class name for element with error message |
| errorClass | class name for error validation |
| successClass | class name for success validation |
| inputParentClass | class name for parent  |
| validators | object with custom validate function |
| validatorsError | object with error message for custom validate |

Custom validate example

```js
Vue.use(MPValidate, {
	validators: {
		example: function(value) {
			return false;
		}
	},
	validatorsError: {
		example: "Incorrect value for custom validate function"
	}
});
```

### Usage

Validate without parameters
```html
<input v-validate.required.string type="text" placeholder="Surname" >
```

Validate with parameter
```html
<input v-validate.required.string="{ minlength: 3, maxlength: 15 }" type="text" placeholder="First name" autofocus>
```

How to check validate before sending form? We must add event on submit form and next check global function `$validate`
```js
...
methods: {
	checkForm() {
		if(this.$validate('#example-form'))
			console.log('SENDING FORM');
		else
			console.log('Ups. errors');
	},
}
...
```
```html js
<form id="example-form" @submit.prevent="checkForm()" action="" method="post">
	<div class="m-form">
		<div class="m-form_item">
            <label class="m-form_field is-icon">
                <i class="fa fa-id-card-o" aria-hidden="true"></i>
                <input data-name="imieee" v-validate.required.string="{ minlength: 3, maxlength: 15, testt: 10 }" type="text" placeholder="First name" autofocus>
            </label>
        </div>
		<div class="m-form_item">
            <label class="m-form_field is-icon">
                <i class="fa fa-id-card-o" aria-hidden="true"></i>
                <input v-validate.required.string type="text" placeholder="Surname">
            </label>
        </div>
	</div>
</form>
```

License
----

MIT
