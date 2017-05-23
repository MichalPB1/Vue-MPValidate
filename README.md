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
| Property | Description |
| ------ | ------ |
| errorDiv | class name for element with error message |
| errorClass | class name for error validation |
| successClass | class name for success validation |
| inputParentClass | class name for parent  |
| validators | object with custom validate function |
| validatorsError | object with error message for custom validate |


### Default validator
* number
* string
* required
* minlength
* maxlength
* email

Custom validate example

```js
Vue.use(MPValidate, {
	validators: {
		example: (value) => false
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

How to check validate before sending form? We must add event on submit form and next wait for Promise from `$validate`
```js
...
methods: {
	checkForm() {
	    this.$validate('#example-form')
			.then(() => console.log('SENDING FORM'))
			.catch(() => console.log('Ups. errors'));
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
                <input v-validate.required.string="{ minlength: 3, maxlength: 15 }" type="text" placeholder="First name">
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

### Errors message

In error message we can use two placeholder
| Placeholder | Description |
| ------ | ------ |
| %name% | name of validate field |
| %param% | validator param value  |

Validator wihout param - example with required validator
```html
<input v-validate.required type="text" placeholder="Login" >
```
```js
...
validatorsError = 
	...
	required: `Field %name% is required`,
	...
}
...
```

Validator with param - example with maxlength validator
```html
<input v-validate="{ maxlength: 15 }" type="text" placeholder="Login" >
```
```js
...
validatorsError = 
	...
	maxlength: 'You can enter only %param% chars for field %name%'
	...
}
...
```

License
----

MIT
