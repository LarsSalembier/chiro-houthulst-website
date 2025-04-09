# TanStack Form

Overview
TanStack Form is the ultimate solution for handling forms in web applications, providing a powerful and flexible approach to form management. Designed with first-class TypeScript support, headless UI components, and a framework-agnostic design, it streamlines form handling and ensures a seamless experience across various front-end frameworks.

Motivation
Most web frameworks do not offer a comprehensive solution for form handling, leaving developers to create their own custom implementations or rely on less-capable libraries. This often results in a lack of consistency, poor performance, and increased development time. TanStack Form aims to address these challenges by providing an all-in-one solution for managing forms that is both powerful and easy to use.

With TanStack Form, developers can tackle common form-related challenges such as:

Reactive data binding and state management
Complex validation and error handling
Accessibility and responsive design
Internationalization and localization
Cross-platform compatibility and custom styling
By providing a complete solution for these challenges, TanStack Form empowers developers to build robust and user-friendly forms with ease.

TanStack Form is unlike most form libraries you've used before. It's designed for large-scale production usage, with a focus on type safety, performance and composition for an unmatched developer experience.

As a result, we've developed a philosophy around the library's usage that values scalability and long-term developer experience over short and sharable code snippets.

Here's an example of a form following many of our best practices, which will allow you to rapidly develop even high-complexity forms after a short onboarding experience:

tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { TextField, NumberField, SubmitButton } from '~our-app/ui-library'
// We also support Valibot, ArkType, and any other standard schema library
import { z } from 'zod'

const { fieldContext, formContext } = createFormHookContexts()

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
fieldComponents: {
TextField,
NumberField,
},
formComponents: {
SubmitButton,
},
fieldContext,
formContext,
})

const PeoplePage = () => {
const form = useAppForm({
defaultValues: {
username: '',
age: 0,
},
validators: {
// Pass a schema or function to validate
onChange: z.object({
username: z.string(),
age: z.number().min(13),
}),
},
onSubmit: ({ value }) => {
// Do something with form data
alert(JSON.stringify(value, null, 2))
},
})

return (

<form
onSubmit={(e) => {
e.preventDefault()
form.handleSubmit()
}} >
<h1>Personal Information</h1>
{/_ Components are bound to `form` and `field` to ensure extreme type safety _/}
{/_ Use `form.AppField` to render a component bound to a single field _/}
<form.AppField
name="username"
children={(field) => <field.TextField label="Full Name" />}
/>
{/_ The "name" property will throw a TypeScript error if typo'd _/}
<form.AppField
name="age"
children={(field) => <field.NumberField label="Age" />}
/>
{/_ Components in `form.AppForm` have access to the form context _/}
<form.AppForm>
<form.SubmitButton />
</form.AppForm>
</form>
)
}

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(<PeoplePage />)
While we generally suggest using createFormHook for reduced boilerplate in the long-run, we also support one-off components and other behaviors using useForm and form.Field:

tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'

const PeoplePage = () => {
const form = useForm({
defaultValues: {
username: '',
age: 0,
},
onSubmit: ({ value }) => {
// Do something with form data
alert(JSON.stringify(value, null, 2))
},
})

return (
<form.Field
name="age"
validators={{
        // We can choose between form-wide and field-specific validators
        onChange: ({ value }) =>
          value > 13 ? undefined : 'Must be 13 or older',
      }}
children={(field) => (
<>
<input
name={field.name}
value={field.state.value}
onBlur={field.handleBlur}
type="number"
onChange={(e) => field.handleChange(e.target.valueAsNumber)}
/>
{field.state.meta.errors.length ? (
<em>{field.state.meta.errors.join(',')}</em>
) : null}
</>
)}
/>
)
}

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(<PeoplePage />)
All properties from useForm can be used in useAppForm and all properties from form.Field can be used in form.AppField.

This page introduces the basic concepts and terminology used in the @tanstack/react-form library. Familiarizing yourself with these concepts will help you better understand and work with the library.

Form Options
You can create options for your form so that it can be shared between multiple forms by using the formOptions function.

Example:

tsx

const formOpts = formOptions({
defaultValues: {
firstName: '',
lastName: '',
hobbies: [],
} as Person,
})
Form Instance
A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the useForm hook provided by the form options. The hook accepts an object with an onSubmit function, which is called when the form is submitted.

tsx

const form = useForm({
...formOpts,
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
})
You may also create a form instance without using formOptions by using the standalone useForm API:

tsx

const form = useForm({
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
defaultValues: {
firstName: '',
lastName: '',
hobbies: [],
} as Person,
})
Field
A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the form.Field component provided by the form instance. The component accepts a name prop, which should match a key in the form's default values. It also accepts a children prop, which is a render prop function that takes a field object as its argument.

Example:

tsx

<form.Field
name="firstName"
children={(field) => (
<>
<input
value={field.state.value}
onBlur={field.handleBlur}
onChange={(e) => field.handleChange(e.target.value)}
/>
<FieldInfo field={field} />
</>
)}
/>
Field State
Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the field.state property.

Example:

tsx

const {
value,
meta: { errors, isValidating },
} = field.state
There are three field states that can be useful to see how the user interacts with a field: A field is "touched" when the user clicks/tabs into it, "pristine" until the user changes value in it, and "dirty" after the value has been changed. You can check these states via the isTouched, isPristine and isDirty flags, as seen below.

tsx

const { isTouched, isPristine, isDirty } = field.state.meta
Field states

Important note for users coming from React Hook Form: the isDirty flag in TanStack/form is different from the flag with the same name in RHF. In RHF, isDirty = true, when the form's values are different from the original values. If the user changes the values in a form, and then changes them again to end up with values that match the form's default values, isDirty will be false in RHF, but true in TanStack/form. The default values are exposed both on the form's and the field's level in TanStack/form (form.options.defaultValues, field.options.defaultValue), so you can write your own isDefaultValue() helper if you need to emulate RHF's behavior.`

Field API
The Field API is an object passed to the render prop function when creating a field. It provides methods for working with the field's state.

Example:

tsx

<input
value={field.state.value}
onBlur={field.handleBlur}
onChange={(e) => field.handleChange(e.target.value)}
/>
Validation
@tanstack/react-form provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the form.Field component using the validators prop.

Example:

tsx

<form.Field
name="firstName"
validators={{
    onChange: ({ value }) =>
      !value
        ? 'A first name is required'
        : value.length < 3
          ? 'First name must be at least 3 characters'
          : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') && 'No "error" allowed in first name'
    },
  }}
children={(field) => (
<>
<input
value={field.state.value}
onBlur={field.handleBlur}
onChange={(e) => field.handleChange(e.target.value)}
/>
<FieldInfo field={field} />
</>
)}
/>
Validation with Standard Schema Libraries
In addition to hand-rolled validation options, we also support the Standard Schema specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

Zod
Valibot
ArkType
tsx

import { z } from 'zod'

const userSchema = z.object({
age: z.number().gte(13, 'You must be 13 to make an account'),
})

function App() {
const form = useForm({
defaultValues: {
age: 0,
},
validators: {
onChange: userSchema,
},
})
return (

<div>
<form.Field
name="age"
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
</div>
)
}
Reactivity
@tanstack/react-form offers various ways to subscribe to form and field state changes, most notably the useStore(form.store) hook and the form.Subscribe component. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example:

tsx

const firstName = useStore(form.store, (state) => state.values.firstName)
//...
<form.Subscribe
selector={(state) => [state.canSubmit, state.isSubmitting]}
children={([canSubmit, isSubmitting]) => (
<button type="submit" disabled={!canSubmit}>
{isSubmitting ? '...' : 'Submit'}
</button>
)}
/>
It is important to remember that while the useStore hook's selector prop is optional, it is strongly recommended to provide one, as omitting it will result in unnecessary re-renders.

tsx

// Correct use
const firstName = useStore(form.store, (state) => state.values.firstName)
const errors = useStore(form.store, (state) => state.errorMap)
// Incorrect use
const store = useStore(form.store)
Note: The usage of the useField hook to achieve reactivity is discouraged since it is designed to be used thoughtfully within the form.Field component. You might want to use useStore(form.store) instead.

Listeners
@tanstack/react-form allows you to react to specific triggers and "listen" to them to dispatch side effects.

Example:

tsx

<form.Field
name="country"
listeners={{
    onChange: ({ value }) => {
      console.log(`Country changed to: ${value}, resetting province`)
      form.setFieldValue('province', '')
    },
  }}
/>
More information can be found at Listeners

Array Fields
Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the form.Field component with the mode="array" prop.

When working with array fields, you can use the fields pushValue, removeValue, swapValues and moveValue methods to add, remove, and swap values in the array.

Example:

tsx

<form.Field
name="hobbies"
mode="array"
children={(hobbiesField) => (

<div>
Hobbies
<div>
{!hobbiesField.state.value.length
? 'No hobbies found.'
: hobbiesField.state.value.map((\_, i) => (
<div key={i}>
<form.Field
name={`hobbies[${i}].name`}
children={(field) => {
return (
<div>
<label htmlFor={field.name}>Name:</label>
<input
id={field.name}
name={field.name}
value={field.state.value}
onBlur={field.handleBlur}
onChange={(e) => field.handleChange(e.target.value)}
/>
<button
type="button"
onClick={() => hobbiesField.removeValue(i)} >
X
</button>
<FieldInfo field={field} />
</div>
)
}}
/>
<form.Field
name={`hobbies[${i}].description`}
children={(field) => {
return (
<div>
<label htmlFor={field.name}>Description:</label>
<input
id={field.name}
name={field.name}
value={field.state.value}
onBlur={field.handleBlur}
onChange={(e) => field.handleChange(e.target.value)}
/>
<FieldInfo field={field} />
</div>
)
}}
/>
</div>
))}
</div>
<button
type="button"
onClick={() =>
hobbiesField.pushValue({
name: '',
description: '',
yearsOfExperience: 0,
})
} >
Add hobby
</button>
</div>
)}
/>
Reset Buttons
When using <button type="reset"> in conjunction with TanStack Form's form.reset(), you need to prevent the default HTML reset behavior to avoid unexpected resets of form elements (especially <select> elements) to their initial HTML values. Use event.preventDefault() inside the button's onClick handler to prevent the native form reset.

Example:

tsx

<button
type="reset"
onClick={(event) => {
event.preventDefault()
form.reset()
}}

> Reset
> </button>
> Alternatively, you can use <button type="button"> to prevent the native HTML reset.

tsx

<button
type="button"
onClick={() => {
form.reset()
}}

> Reset
> </button>
> These are the basic concepts and terminology used in the @tanstack/react-form library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.

Form and Field Validation
At the core of TanStack Form's functionalities is the concept of validation. TanStack Form makes validation highly customizable:

You can control when to perform the validation (on change, on input, on blur, on submit...)
Validation rules can be defined at the field level or at the form level
Validation can be synchronous or asynchronous (for example, as a result of an API call)
When is validation performed?
It's up to you! The <Field /> component accepts some callbacks as props such as onChange or onBlur. Those callbacks are passed the current value of the field, as well as the fieldAPI object, so that you can perform the validation. If you find a validation error, simply return the error message as string and it will be available in field.state.meta.errors.

Here is an example:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors ? (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
In the example above, the validation is done at each keystroke (onChange). If, instead, we wanted the validation to be done when the field is blurred, we would change the code above like so:

tsx

<form.Field
name="age"
validators={{
    onBlur: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field.handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors ? (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
So you can control when the validation is done by implementing the desired callback. You can even perform different pieces of validation at different times:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
    onBlur: ({ value }) => (value < 0 ? 'Invalid value' : undefined),
  }}

> {(field) => (

    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field.handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors ? (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
In the example above, we are validating different things on the same field at different times (at each keystroke and when blurring the field). Since field.state.meta.errors is an array, all the relevant errors at a given time are displayed. You can also use field.state.meta.errorMap to get errors based on when the validation was done (onChange, onBlur etc...). More info about displaying errors below.

Displaying Errors
Once you have your validation in place, you can map the errors from an array to be displayed in your UI:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => {

    return (
      <>
        {/* ... */}
        {field.state.meta.errors.length ? (
          <em>{field.state.meta.errors.join(',')}</em>
        ) : null}
      </>
    )

}}
</form.Field>
Or use the errorMap property to access the specific error you're looking for:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      {/* ... */}
      {field.state.meta.errorMap['onChange'] ? (
        <em>{field.state.meta.errorMap['onChange']}</em>
      ) : null}
    </>

)}
</form.Field>
It's worth mentioning that our errors array and the errorMap matches the types returned by the validators. This means that:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) => (value < 13 ? { isOldEnough: false } : undefined),
  }}

> {(field) => (

    <>
      {/* ... */}
      {/* errorMap.onChange is type `{isOldEnough: false} | undefined` */}
      {/* meta.errors is type `Array<{isOldEnough: false} | undefined>` */}
      {!field.state.meta.errorMap['onChange']?.isOldEnough ? (
        <em>The user is not old enough</em>
      ) : null}
    </>

)}
</form.Field>
Validation at field level vs at form level
As shown above, each <Field> accepts its own validation rules via the onChange, onBlur etc... callbacks. It is also possible to define validation rules at the form level (as opposed to field by field) by passing similar callbacks to the useForm() hook.

Example:

tsx

export default function App() {
const form = useForm({
defaultValues: {
age: 0,
},
onSubmit: async ({ value }) => {
console.log(value)
},
validators: {
// Add validators to the form the same way you would add them to a field
onChange({ value }) {
if (value.age < 13) {
return 'Must be 13 or older to sign'
}
return undefined
},
},
})

// Subscribe to the form's error map so that updates to it will render
// alternately, you can use `form.Subscribe`
const formErrorMap = useStore(form.store, (state) => state.errorMap)

return (

<div>
{/_ ... _/}
{formErrorMap.onChange ? (
<div>
<em>There was an error on the form: {formErrorMap.onChange}</em>
</div>
) : null}
{/_ ... _/}
</div>
)
}
Setting field-level errors from the form's validators
You can set errors on the fields from the form's validators. One common use case for this is validating all the fields on submit by calling a single API endpoint in the form's onSubmitAsync validator.

tsx

export default function App() {
const form = useForm({
defaultValues: {
age: 0,
},
validators: {
onSubmitAsync: async ({ value }) => {
// Verify the age on the server
const isOlderThan13 = await verifyAgeOnServer(value.age)
if (!isOlderThan13) {
return {
form: 'Invalid data', // The `form` key is optional
fields: {
age: 'Must be 13 or older to sign',
},
}
}

        return null
      },
    },

})

return (

<div>
<form
onSubmit={(e) => {
e.preventDefault()
e.stopPropagation()
void form.handleSubmit()
}} >
<form.Field name="age">
{(field) => (
<>
<label htmlFor={field.name}>Age:</label>
<input
id={field.name}
name={field.name}
value={field.state.value}
type="number"
onChange={(e) => field.handleChange(e.target.valueAsNumber)}
/>
{field.state.meta.errors ? (
<em role="alert">{field.state.meta.errors.join(', ')}</em>
) : null}
</>
)}
</form.Field>
<form.Subscribe
selector={(state) => [state.errorMap]}
children={([errorMap]) =>
errorMap.onSubmit ? (
<div>
<em>There was an error on the form: {errorMap.onSubmit}</em>
</div>
) : null
}
/>
{/_..._/}
</form>
</div>
)
}
Something worth mentioning is that if you have a form validation function that returns an error, that error may be overwritten by the field-specific validation.

This means that:

jsx

const form = useForm({
defaultValues: {
age: 0,
},
validators: {
onChange: ({ value }) => {
return {
fields: {
age: value.age < 12 ? 'Too young!' : undefined,
},
}
},
},
})

// ...

return (
<form.Field
name="age"
validators={{
      onChange: ({ value }) => (value % 2 === 0 ? 'Must be odd!' : undefined),
    }}
/>
)
Will only show 'Must be odd! even if the 'Too young!' error is returned by the form-level validation.

Asynchronous Functional Validation
While we suspect most validations will be synchronous, there are many instances where a network call or some other async operation would be useful to validate against.

To do this, we have dedicated onChangeAsync, onBlurAsync, and other methods that can be used to validate against:

tsx

<form.Field
name="age"
validators={{
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value < 13 ? 'You must be 13 to make an account' : undefined
    },
  }}

> {(field) => (

    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors ? (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
Synchronous and Asynchronous validations can coexist. For example, it is possible to define both onBlur and onBlurAsync on the same field:

tsx

<form.Field
name="age"
validators={{
    onBlur: ({ value }) => (value < 13 ? 'You must be at least 13' : undefined),
    onBlurAsync: async ({ value }) => {
      const currentAge = await fetchCurrentAgeOnProfile()
      return value < currentAge ? 'You can only increase the age' : undefined
    },
  }}

> {(field) => (

    <>
      <label htmlFor={field.name}>Age:</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {field.state.meta.errors ? (
        <em role="alert">{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
The synchronous validation method (onBlur) is run first and the asynchronous method (onBlurAsync) is only run if the synchronous one (onBlur) succeeds. To change this behaviour, set the asyncAlways option to true, and the async method will be run regardless of the result of the sync method.

Built-in Debouncing
While async calls are the way to go when validating against the database, running a network request on every keystroke is a good way to DDOS your database.

Instead, we enable an easy method for debouncing your async calls by adding a single property:

tsx

<form.Field
name="age"
asyncDebounceMs={500}
validators={{
    onChangeAsync: async ({ value }) => {
      // ...
    },
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
This will debounce every async call with a 500ms delay. You can even override this property on a per-validation property:

tsx

<form.Field
name="age"
asyncDebounceMs={500}
validators={{
    onChangeAsyncDebounceMs: 1500,
    onChangeAsync: async ({ value }) => {
      // ...
    },
    onBlurAsync: async ({ value }) => {
      // ...
    },
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
This will run onChangeAsync every 1500ms while onBlurAsync will run every 500ms.

Validation through Schema Libraries
While functions provide more flexibility and customization over your validation, they can be a bit verbose. To help solve this, there are libraries that provide schema-based validation to make shorthand and type-strict validation substantially easier. You can also define a single schema for your entire form and pass it to the form level, errors will be automatically propagated to the fields.

Standard Schema Libraries
TanStack Form natively supports all libraries following the Standard Schema specification, most notably:

Zod
Valibot
ArkType
Effect/Schema
Note: make sure to use the latest version of the schema libraries as older versions might not support Standard Schema yet.

To use schemas from these libraries you can pass them to the validators props as you would do with a custom function:

tsx

const userSchema = z.object({
age: z.number().gte(13, 'You must be 13 to make an account'),
})

function App() {
const form = useForm({
defaultValues: {
age: 0,
},
validators: {
onChange: userSchema,
},
})
return (

<div>
<form.Field
name="age"
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
</div>
)
}
Async validations on form and field level are supported as well:

tsx

<form.Field
name="age"
validators={{
    onChange: z.number().gte(13, 'You must be 13 to make an account'),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.number().refine(
      async (value) => {
        const currentAge = await fetchCurrentAgeOnProfile()
        return value >= currentAge
      },
      {
        message: 'You can only increase the age',
      },
    ),
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
Preventing invalid forms from being submitted
The onChange, onBlur etc... callbacks are also run when the form is submitted and the submission is blocked if the form is invalid.

The form state object has a canSubmit flag that is false when any field is invalid and the form has been touched (canSubmit is true until the form has been touched, even if some fields are "technically" invalid based on their onChange/onBlur props).

You can subscribe to it via form.Subscribe and use the value in order to, for example, disable the submit button when the form is invalid (in practice, disabled buttons are not accessible, use aria-disabled instead).

tsx

const form = useForm(/_ ... _/)

return (
/_ ... _/

// Dynamic submit button
<form.Subscribe
selector={(state) => [state.canSubmit, state.isSubmitting]}
children={([canSubmit, isSubmitting]) => (
<button type="submit" disabled={!canSubmit}>
{isSubmitting ? '...' : 'Submit'}
</button>
)}
/>
)

Async Initial Values
Let's say that you want to fetch some data from an API and use it as the initial value of a form.

While this problem sounds simple on the surface, there are hidden complexities you might not have thought of thus far.

For example, you might want to show a loading spinner while the data is being fetched, or you might want to handle errors gracefully. Likewise, you could also find yourself looking for a way to cache the data so that you don't have to fetch it every time the form is rendered.

While we could implement many of these features from scratch, it would end up looking a lot like another project we maintain: TanStack Query.

As such, this guide shows you how you can mix-n-match TanStack Form with TanStack Query to achieve the desired behavior.

Basic Usage
tsx

import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'

export default function App() {
const {data, isLoading} = useQuery({
queryKey: ['data'],
queryFn: async () => {
await new Promise((resolve) => setTimeout(resolve, 1000))
return {firstName: 'FirstName', lastName: "LastName"}
}
})

const form = useForm({
defaultValues: {
firstName: data?.firstName ?? '',
lastName: data?.lastName ?? '',
},
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
})

if (isLoading) return <p>Loading..</p>

return (
// ...
)
}
This will show a loading spinner until the data is fetched, and then it will render the form with the fetched data as the initial values.

Arrays
TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

Basic Usage
To use an array, you can use field.state.value on an array value:

jsx

function App() {
const form = useForm({
defaultValues: {
people: [],
},
})

return (
<form.Field name="people" mode="array">
{(field) => (

<div>
{field.state.value.map((\_, i) => {
// ...
})}
</div>
)}
</form.Field>
)
}
This will generate the mapped JSX every time you run pushValue on field:

jsx

<button onClick={() => field.pushValue({ name: '', age: 0 })} type="button">
Add person
</button>
Finally, you can use a subfield like so:

jsx

<form.Field key={i} name={`people[${i}].name`}>
{(subField) => (
<input
value={subField.state.value}
onChange={(e) => subField.handleChange(e.target.value)}
/>
)}
</form.Field>
Full Example
jsx

function App() {
const form = useForm({
defaultValues: {
people: [],
},
onSubmit({ value }) {
alert(JSON.stringify(value))
},
})

return (

<div>
<form
onSubmit={(e) => {
e.preventDefault()
e.stopPropagation()
form.handleSubmit()
}} >
<form.Field name="people" mode="array">
{(field) => {
return (
<div>
{field.state.value.map((\_, i) => {
return (
<form.Field key={i} name={`people[${i}].name`}>
{(subField) => {
return (
<div>
<label>
<div>Name for person {i}</div>
<input
value={subField.state.value}
onChange={(e) =>
subField.handleChange(e.target.value)
}
/>
</label>
</div>
)
}}
</form.Field>
)
})}
<button
onClick={() => field.pushValue({ name: '', age: 0 })}
type="button" >
Add person
</button>
</div>
)
}}
</form.Field>
<form.Subscribe
selector={(state) => [state.canSubmit, state.isSubmitting]}
children={([canSubmit, isSubmitting]) => (
<button type="submit" disabled={!canSubmit}>
{isSubmitting ? '...' : 'Submit'}
</button>
)}
/>
</form>
</div>
)
}

Link Two Form Fields Together
You may find yourself needing to link two fields together; when one is validated as another field's value has changed. One such usage is when you have both a password and confirm_password field, where you want to confirm_password to error out when password's value does not match; regardless of which field triggered the value change.

Imagine the following userflow:

User updates confirm password field.
User updates the non-confirm password field.
In this example, the form will still have errors present, as the "confirm password" field validation has not been re-ran to mark as accepted.

To solve this, we need to make sure that the "confirm password" validation is re-run when the password field is updated. To do this, you can add a onChangeListenTo property to the confirm_password field.

tsx

function App() {
const form = useForm({
defaultValues: {
password: '',
confirm_password: '',
},
// ...
})

return (

<div>
<form.Field name="password">
{(field) => (
<label>
<div>Password</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
)}
</form.Field>
<form.Field
name="confirm_password"
validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue('password')) {
              return 'Passwords do not match'
            }
            return undefined
          },
        }} >
{(field) => (
<div>
<label>
<div>Confirm Password</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
{field.state.meta.errors.map((err) => (
<div key={err}>{err}</div>
))}
</div>
)}
</form.Field>
</div>
)
}
This similarly works with onBlurListenTo property, which will re-run the validation when the field is blurred.

Reactivity
Tanstack Form doesn't cause re-renders when interacting with the form. So you might find yourself trying to use a form or field state value without success.

If you would like to access reactive values, you will need to subscribe to them using one of two methods: useStore or the form.Subscribe component.

Some uses for these subscriptions are rendering up-to-date field values, determining what to render based on a condition, or using field values inside the logic of your component.

For situations where you want to "react" to triggers, check out the listener API.

useStore
The useStore hook is perfect when you need to access form values within the logic of your component. useStore takes two parameters. First, the form store. Second a selector to fine tune the piece of the form you wish to subscribe to.

tsx

const firstName = useStore(form.store, (state) => state.values.firstName)
const errors = useStore(form.store, (state) => state.errorMap)
You can access any piece of the form state in the selector.

Note, that useStore will cause a whole component re-render whenever the value subscribed to changes.

While it IS possible to omit the selector, resist the urge as omitting it would result in many unnecessary re-renders whenever any of the form state changes.

form.Subscribe
The form.Subscribe component is best suited when you need to react to something within the UI of your component. For example, showing or hiding ui based on the value of a form field.

tsx

<form.Subscribe
selector={(state) => state.values.firstName}
children={(firstName) => (
<form.Field>
{(field) => (
<input
          name="lastName"
          value={field.state.lastName}
          onChange={field.handleChange}
        />
)}
</form.Field>
)}
/>
The form.Subscribe component doesn't trigger component-level re-renders. Anytime the value subscribed to changes, only the form.Subscribe component re-renders.

The choice between whether to use useStore or form.Subscribe mainly boils down to that if it's rendered in the ui, reach for form.Subscribe for its optimizations perks, and if you need the reactivity within the logic, then useStore is the choice to make.

Side effects for event triggers
For situations where you want to "affect" or "react" to triggers, there's the listener API. For example, if you, as the developer, want to reset a form field as a result of another field changing, you would use the listener API.

Imagine the following user flow:

User selects a country from a drop-down.
User then selects a province from another drop-down.
User changes the selected country to a different one.
In this example, when the user changes the country, the selected province needs to be reset as it's no longer valid. With the listener API, we can subscribe to the onChange event and dispatch a reset to the field "province" when the listener is fired.

Events that can be "listened" to are:

onChange
onBlur
onMount
onSubmit
tsx

function App() {
const form = useForm({
defaultValues: {
country: '',
province: '',
},
// ...
})

return (

<div>
<form.Field
name="country"
listeners={{
          onChange: ({ value }) => {
            console.log(`Country changed to: ${value}, resetting province`)
            form.setFieldValue('province', '')
          },
        }} >
{(field) => (
<label>
<div>Country</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
)}
</form.Field>

      <form.Field name="province">
        {(field) => (
          <label>
            <div>Province</div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </label>
        )}
      </form.Field>
    </div>

)
}

Custom Errors
TanStack Form provides complete flexibility in the types of error values you can return from validators. String errors are the most common and easy to work with, but the library allows you to return any type of value from your validators.

As a general rule, any truthy value is considered as an error and will mark the form or field as invalid, while falsy values (false, undefined, null, etc..) mean there is no error, the form or field is valid.

Return String Values from Forms
tsx

<form.Field
name="username"
validators={{
    onChange: ({ value }) =>
      value.length < 3 ? 'Username must be at least 3 characters' : undefined,
  }}
/>
For form-level validation affecting multiple fields:

tsx

const form = useForm({
defaultValues: {
username: '',
email: '',
},
validators: {
onChange: ({ value }) => {
return {
fields: {
username:
value.username.length < 3 ? 'Username too short' : undefined,
email: !value.email.includes('@') ? 'Invalid email' : undefined,
},
}
},
},
})
String errors are the most common type and are easily displayed in your UI:

tsx

{
field.state.meta.errors.map((error, i) => (

<div key={i} className="error">
{error}
</div>
))
}
Numbers
Useful for representing quantities, thresholds, or magnitudes:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) => (value < 18 ? 18 - value : undefined),
  }}
/>
Display in UI:

tsx

{
/_ TypeScript knows the error is a number based on your validator _/
}
;<div className="error">
You need {field.state.meta.errors[0]} more years to be eligible

</div>
Booleans
Simple flags to indicate error state:

tsx

<form.Field
name="accepted"
validators={{
    onChange: ({ value }) => (!value ? true : undefined),
  }}
/>
Display in UI:

tsx

{
field.state.meta.errors[0] === true && (

<div className="error">You must accept the terms</div>
)
}
Objects
Rich error objects with multiple properties:

tsx

<form.Field
name="email"
validators={{
    onChange: ({ value }) => {
      if (!value.includes('@')) {
        return {
          message: 'Invalid email format',
          severity: 'error',
          code: 1001,
        }
      }
      return undefined
    },
  }}
/>
Display in UI:

tsx

{
typeof field.state.meta.errors[0] === 'object' && (

<div className={`error ${field.state.meta.errors[0].severity}`}>
{field.state.meta.errors[0].message}
<small> (Code: {field.state.meta.errors[0].code})</small>
</div>
)
}
in the example above it depends on the event error you want to display.

Arrays
Multiple error messages for a single field:

tsx

<form.Field
name="password"
validators={{
onChange: ({ value }) => {
const errors = []
if (value.length < 8) errors.push('Password too short')
if (!/[A-Z]/.test(value)) errors.push('Missing uppercase letter')
if (!/[0-9]/.test(value)) errors.push('Missing number')

      return errors.length ? errors : undefined
    },

}}
/>
Display in UI:

tsx

{
Array.isArray(field.state.meta.errors) && (

<ul className="error-list">
{field.state.meta.errors.map((err, i) => (
<li key={i}>{err}</li>
))}
</ul>
)
}
The disableErrorFlat Prop on Fields
By default, TanStack Form flattens errors from all validation sources (onChange, onBlur, onSubmit) into a single errors array. The disableErrorFlat prop preserves the error sources:

tsx

<form.Field
name="email"
disableErrorFlat
validators={{
    onChange: ({ value }) =>
      !value.includes('@') ? 'Invalid email format' : undefined,
    onBlur: ({ value }) =>
      !value.endsWith('.com') ? 'Only .com domains allowed' : undefined,
    onSubmit: ({ value }) => (value.length < 5 ? 'Email too short' : undefined),
  }}
/>
Without disableErrorFlat, all errors would be combined into field.state.meta.errors. With it, you can access errors by their source:

tsx

{
field.state.meta.errorMap.onChange && (

<div className="real-time-error">{field.state.meta.errorMap.onChange}</div>
)
}

{
field.state.meta.errorMap.onBlur && (

<div className="blur-feedback">{field.state.meta.errorMap.onBlur}</div>
)
}

{
field.state.meta.errorMap.onSubmit && (

<div className="submit-error">{field.state.meta.errorMap.onSubmit}</div>
)
}
This is useful for:

Displaying different types of errors with different UI treatments
Prioritizing errors (e.g., showing submission errors more prominently)
Implementing progressive disclosure of errors
Type Safety of errors and errorMap
TanStack Form provides strong type safety for error handling. Each key in the errorMap has exactly the type returned by its corresponding validator, while the errors array contains a union type of all the possible error values from all validators:

tsx

<form.Field
name="password"
validators={{
    onChange: ({ value }) => {
      // This returns a string or undefined
      return value.length < 8 ? 'Too short' : undefined
    },
    onBlur: ({ value }) => {
      // This returns an object or undefined
      if (!/[A-Z]/.test(value)) {
        return { message: 'Missing uppercase', level: 'warning' }
      }
      return undefined
    },
  }}
children={(field) => {
// TypeScript knows that errors[0] can be string | { message: string, level: string } | undefined
const error = field.state.meta.errors[0]

    // Type-safe error handling
    if (typeof error === 'string') {
      return <div className="string-error">{error}</div>
    } else if (error && typeof error === 'object') {
      return <div className={error.level}>{error.message}</div>
    }

    return null

}}
/>
The errorMap property is also fully typed, matching the return types of your validation functions:

tsx

// With disableErrorFlat
<form.Field
name="email"
disableErrorFlat
validators={{
    onChange: ({ value }): string | undefined =>
      !value.includes("@") ? "Invalid email" : undefined,
    onBlur: ({ value }): { code: number, message: string } | undefined =>
      !value.endsWith(".com") ? { code: 100, message: "Wrong domain" } : undefined
  }}
children={(field) => {
// TypeScript knows the exact type of each error source
const onChangeError: string | undefined = field.state.meta.errorMap.onChange;
const onBlurError: { code: number, message: string } | undefined = field.state.meta.errorMap.onBlur;

    return (/* ... */);

}}
/>
This type safety helps catch errors at compile time instead of runtime, making your code more reliable and maintainable.

Submission handling
In a situation where you want to have multiple form submission types, for example, a form that has a button that navigates to a sub-form and another button that handles a standard submission, you can make use of the onSubmitMeta prop and the handleSubmit function overloads.

Basic Usage
First you must define the default state of the form.onSubmitMeta prop:

tsx

const form = useForm({
defaultValues: {
firstName: 'Rick',
},
// {} is the default value passed to `onSubmit`'s `meta` property
onSubmitMeta: {} as { lastName: string },
onSubmit: async ({ value, meta }) => {
// Do something with the values passed via handleSubmit
console.log(`${value.firstName} - ${meta}`)
},
})
Note: the default state of onSubmitMeta is never, so if the prop is not provided and you try to access it in handleSubmit, or onSubmit it will error.

Then when you call onSubmit you can provide it the predefined meta like so:

tsx

<form
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit({
      lastName: 'Astley',
    })
  }}
></form>

UI Libraries
Usage of TanStack Form with UI Libraries
TanStack Form is a headless library, offering you complete flexibility to style it as you see fit. It's compatible with a wide range of UI libraries, including Tailwind, Material UI, Mantine, or even plain CSS.

This guide focuses on Material UI and Mantine, but the concepts are applicable to any UI library of your choice.

Prerequisites
Before integrating TanStack Form with a UI library, ensure the necessary dependencies are installed in your project:

For Material UI, follow the installation instructions on their official site.
For Mantine, refer to their documentation.
Note: While you can mix and match libraries, it's generally advisable to stick with one to maintain consistency and minimize bloat.

Example with Mantine
Here's an example demonstrating the integration of TanStack Form with Mantine components:

tsx

import { TextInput, Checkbox } from '@mantine/core'
import { useForm } from '@tanstack/react-form'

export default function App() {
const { Field, handleSubmit, state } = useForm({
defaultValues: {
firstName: '',
lastName: '',
isChecked: false,
},
onSubmit: async ({ value }) => {
// Handle form submission
console.log(value)
},
})

return (
<>

<form
onSubmit={(e) => {
e.preventDefault()
handleSubmit()
}} >
<Field
name="firstName"
children={({ state, handleChange, handleBlur }) => (
<TextInput
defaultValue={state.value}
onChange={(e) => handleChange(e.target.value)}
onBlur={handleBlur}
placeholder="Enter your name"
/>
)}
/>
<Field
name="isChecked"
children={({ state, handleChange, handleBlur }) => (
<Checkbox
onChange={(e) => handleChange(e.target.checked)}
onBlur={handleBlur}
checked={state.value}
/>
)}
/>
</form>
<div>
<pre>{JSON.stringify(state.values, null, 2)}</pre>
</div>
</>
)
}
Initially, we utilize the useForm hook from TanStack and destructure the necessary properties. This step is optional; alternatively, you could use const form = useForm() if preferred. TypeScript's type inference ensures a smooth experience regardless of the approach.
The Field component, derived from useForm, accepts several properties, such as validators. For this demonstration, we focus on two primary properties: name and children.
The name property identifies each Field, for instance, firstName in our example.
The children property leverages the concept of render props, allowing us to integrate components without unnecessary abstractions.
TanStack's design relies heavily on render props, providing access to children within the Field component. This approach is entirely type-safe. When integrating with Mantine components, such as TextInput, we selectively destructure properties like state.value, handleChange, and handleBlur. This selective approach is due to the slight differences in types between TextInput and the field we get in the children.
By following these steps, you can seamlessly integrate Mantine components with TanStack Form.
This methodology is equally applicable to other components, such as Checkbox, ensuring consistent integration across different UI elements.
Usage with Material UI
The process for integrating Material UI components is similar. Here's an example using TextField and Checkbox from Material UI:

tsx

        <Field
            name="lastName"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <TextField
                  id="filled-basic"
                  label="Filled"
                  variant="filled"
                  defaultValue={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Enter your last name"
                />
              );
            }}
          />

           <Field
            name="isMuiCheckBox"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <MuiCheckbox
                  onChange={(e) => handleChange(e.target.checked)}
                  onBlur={handleBlur}
                  checked={state.value}
                />
              );
            }}
          />

The integration approach is the same as with Mantine.
The primary difference lies in the specific Material UI component properties and styling options.

Form Composition
A common criticism of TanStack Form is its verbosity out-of-the-box. While this can be useful for educational purposes - helping enforce understanding our APIs - it's not ideal in production use cases.

As a result, while form.Field enables the most powerful and flexible usage of TanStack Form, we provide APIs that wrap it and make your application code less verbose.

Custom Form Hooks
The most powerful way to compose forms is to create custom form hooks. This allows you to create a form hook that is tailored to your application's needs, including pre-bound custom UI components and more.

At it's most basic, createFormHook is a function that takes a fieldContext and formContext and returns a useAppForm hook.

This un-customized useAppForm hook is identical to useForm, but that will quickly change as we add more options to createFormHook.

tsx

import { createFormHookContexts, createFormHook } from '@tanstack/react-form'

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } =
createFormHookContexts()

const { useAppForm } = createFormHook({
fieldContext,
formContext,
// We'll learn more about these options later
fieldComponents: {},
formComponents: {},
})

function App() {
const form = useAppForm({
// Supports all useForm options
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
})

return <form.Field /> // ...
}
Pre-bound Field Components
Once this scaffolding is in place, you can start adding custom field and form components to your form hook.

Note: the useFieldContext must be the same one exported from your custom form context

tsx

import { useFieldContext } from './form-context.tsx'

export function TextField({ label }: { label: string }) {
// The `Field` infers that it should have a `value` type of `string`
const field = useFieldContext<string>()
return (
<label>

<div>{label}</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
)
}
You're then able to register this component with your form hook.

tsx

import { TextField } from './text-field.tsx'

const { useAppForm } = createFormHook({
fieldContext,
formContext,
fieldComponents: {
TextField,
},
formComponents: {},
})
And use it in your form:

tsx

function App() {
const form = useAppForm({
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
})

return (
// Notice the `AppField` instead of `Field`; `AppField` provides the required context
<form.AppField
name="firstName"
children={(field) => <field.TextField label="First Name" />}
/>
)
}
This not only allows you to reuse the UI of your shared component, but retains the type-safety you'd expect from TanStack Form: Typo name and get a TypeScript error.

A note on performance
While context is a valuable tool in the React ecosystem, there's appropriate concern from many users that providing a reactive value through a context will cause unnecessary re-renders.

Unfamiliar with this performance concern? Mark Erikson's blog post explaining why Redux solves many of these problems is a great place to start.

While this is a good concern to call out, it's not a problem for TanStack Form; the values provided through context are not reactive themselves, but instead are static class instances with reactive properties (using TanStack Store as our signals implementation to power the show).

Pre-bound Form Components
While form.AppField solves many of the problems with Field boilerplate and reusability, it doesn't solve the problem of form boilerplate and reusability.

In particular, being able to share instances of form.Subscribe for, say, a reactive form submission button is a common usecase.

tsx

function SubscribeButton({ label }: { label: string }) {
const form = useFormContext()
return (
<form.Subscribe selector={(state) => state.isSubmitting}>
{(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
</form.Subscribe>
)
}

const { useAppForm, withForm } = createFormHook({
fieldComponents: {},
formComponents: {
SubscribeButton,
},
fieldContext,
formContext,
})

function App() {
const form = useAppForm({
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
})

return (
<form.AppForm>
// Notice the `AppForm` component wrapper; `AppForm` provides the required
context
<form.SubscribeButton label="Submit" />
</form.AppForm>
)
}
Breaking big forms into smaller pieces
Sometimes forms get very large; it's just how it goes sometimes. While TanStack Form supports large forms well, it's never fun to work with hundreds or thousands of lines of code long files.

To solve this, we support breaking forms into smaller pieces using the withForm higher-order component.

tsx

const { useAppForm, withForm } = createFormHook({
fieldComponents: {
TextField,
},
formComponents: {
SubscribeButton,
},
fieldContext,
formContext,
})

const ChildForm = withForm({
// These values are only used for type-checking, and are not used at runtime
// This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
// Optional, but adds props to the `render` function in addition to `form`
props: {
// These props are also set as default values for the `render` function
title: 'Child Form',
},
render: function Render({ form, title }) {
return (

<div>
<p>{title}</p>
<form.AppField
name="firstName"
children={(field) => <field.TextField label="First Name" />}
/>
<form.AppForm>
<form.SubscribeButton label="Submit" />
</form.AppForm>
</div>
)
},
})

function App() {
const form = useAppForm({
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
})

return <ChildForm form={form} title={'Testing'} />
}
withForm FAQ
Why a higher-order component instead of a hook?

While hooks are the future of React, higher-order components are still a powerful tool for composition. In particular, the API of useForm enables us to have strong type-safety without requiring users to pass generics.

Why am I getting ESLint errors about hooks in render?

ESLint looks for hooks in the top-level of a function, and render may not be recogized as a top-level component, depending on how you defined it.

tsx

// This will cause ESLint errors with hooks usage
const ChildForm = withForm({
// ...
render: ({ form, title }) => {
// ...
},
})
tsx

// This works fine
const ChildForm = withForm({
// ...
render: function Render({ form, title }) {
// ...
},
})
Tree-shaking form and field components
While the above examples are great for getting started, they're not ideal for certain use-cases where you might have hundreds of form and field components. In particular, you may not want to include all of your form and field components in the bundle of every file that uses your form hook.

To solve this, you can mix the createFormHook TanStack API with the React lazy and Suspense components:

typescript

// src/hooks/form-context.ts
import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
createFormHookContexts()
tsx

// src/components/text-field.tsx
import { useFieldContext } from '../hooks/form-context.tsx'

export default function TextField({ label }: { label: string }) {
const field = useFieldContext<string>()

return (
<label>

<div>{label}</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
)
}
tsx

// src/hooks/form.ts
import { lazy } from 'react'
import { createFormHook } from '@tanstack/react-form'

const TextField = lazy(() => import('../components/text-fields.tsx'))

const { useAppForm, withForm } = createFormHook({
fieldContext,
formContext,
fieldComponents: {
TextField,
},
formComponents: {},
})
tsx

// src/App.tsx
import { Suspense } from 'react'
import { PeoplePage } from './features/people/page.tsx'

export default function App() {
return (
<Suspense fallback={<p>Loading...</p>}>
<PeopleForm />
</Suspense>
)
}
This will show the Suspense fallback while the TextField component is being loaded, and then render the form once it's loaded.

Putting it all together
Now that we've covered the basics of creating custom form hooks, let's put it all together in a single example.

tsx

// /src/hooks/form.ts, to be used across the entire app
const { fieldContext, useFieldContext, formContext, useFormContext } =
createFormHookContexts()

function TextField({ label }: { label: string }) {
const field = useFieldContext<string>()
return (
<label>

<div>{label}</div>
<input
value={field.state.value}
onChange={(e) => field.handleChange(e.target.value)}
/>
</label>
)
}

function SubscribeButton({ label }: { label: string }) {
const form = useFormContext()
return (
<form.Subscribe selector={(state) => state.isSubmitting}>
{(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
</form.Subscribe>
)
}

const { useAppForm, withForm } = createFormHook({
fieldComponents: {
TextField,
},
formComponents: {
SubscribeButton,
},
fieldContext,
formContext,
})

// /src/features/people/shared-form.ts, to be used across `people` features
const formOpts = formOptions({
defaultValues: {
firstName: 'John',
lastName: 'Doe',
},
})

// /src/features/people/nested-form.ts, to be used in the `people` page
const ChildForm = withForm({
...formOpts,
// Optional, but adds props to the `render` function outside of `form`
props: {
title: 'Child Form',
},
render: ({ form, title }) => {
return (

<div>
<p>{title}</p>
<form.AppField
name="firstName"
children={(field) => <field.TextField label="First Name" />}
/>
<form.AppForm>
<form.SubscribeButton label="Submit" />
</form.AppForm>
</div>
)
},
})

// /src/features/people/page.ts
const Parent = () => {
const form = useAppForm({
...formOpts,
})

return <ChildForm form={form} title={'Testing'} />
}

React Meta-Framework Usage
TanStack Form is compatible with React out of the box, supporting SSR and being framework-agnostic. However, specific configurations are necessary, according to your chosen framework.

Today we support the following meta-frameworks:

TanStack Start
Next.js
Remix
Using TanStack Form in TanStack Start
This section focuses on integrating TanStack Form with TanStack Start.

TanStack Start Prerequisites
Start a new TanStack Start project, following the steps in the TanStack Start Quickstart Guide
Install @tanstack/react-form
Start integration
Let's start by creating a formOption that we'll use to share the form's shape across the client and server.

typescript

// app/routes/index.tsx, but can be extracted to any other path
import { formOptions } from '@tanstack/react-form'

// You can pass other form options here
export const formOpts = formOptions({
defaultValues: {
firstName: '',
age: 0,
},
})
Next, we can create a Start Server Action that will handle the form submission on the server.

typescript

// app/routes/index.tsx, but can be extracted to any other path
import {
createServerValidate,
ServerValidateError,
} from '@tanstack/react-form/start'

const serverValidate = createServerValidate({
...formOpts,
onServerValidate: ({ value }) => {
if (value.age < 12) {
return 'Server validation: You must be at least 12 to sign up'
}
},
})

export const handleForm = createServerFn({
method: 'POST',
})
.validator((data: unknown) => {
if (!(data instanceof FormData)) {
throw new Error('Invalid form data')
}
return data
})
.handler(async (ctx) => {
try {
const validatedData = await serverValidate(ctx.data)
console.log('validatedData', validatedData)
// Persist the form data to the database
// await sql`      //   INSERT INTO users (name, email, password)
      //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
      //`
} catch (e) {
if (e instanceof ServerValidateError) {
// Log form errors or do any other logic here
return e.response
}

      // Some other error occurred when parsing the form
      console.error(e)
      setResponseStatus(500)
      return 'There was an internal error'
    }

    return 'Form has validated successfully'

})
Then we need to establish a way to grab the form data from serverValidate's response using another server action:

typescript

// app/routes/index.tsx, but can be extracted to any other path
import { getFormData } from '@tanstack/react-form/start'

export const getFormDataFromServer = createServerFn({ method: 'GET' }).handler(
async () => {
return getFormData()
},
)
Finally, we'll use getFormDataFromServer in our loader to get the state from our server into our client and handleForm in our client-side form component.

tsx

// app/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
mergeForm,
useForm,
useStore,
useTransform,
} from '@tanstack/react-form'

export const Route = createFileRoute('/')({
component: Home,
loader: async () => ({
state: await getFormDataFromServer(),
}),
})

function Home() {
const { state } = Route.useLoaderData()
const form = useForm({
...formOpts,
transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
})

const formErrors = useStore(form.store, (formState) => formState.errors)

return (

<form action={handleForm.url} method="post" encType={'multipart/form-data'}>
{formErrors.map((error) => (
<p key={error as string}>{error}</p>
))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>

)
}
Using TanStack Form in a Next.js App Router
Before reading this section, it's suggested you understand how React Server Components and React Server Actions work. Check out this blog series for more information

This section focuses on integrating TanStack Form with Next.js, particularly using the App Router and Server Actions.

Next.js Prerequisites
Start a new Next.js project, following the steps in the Next.js Documentation. Ensure you select yes for Would you like to use App Router? during the setup to access all new features provided by Next.js.
Install @tanstack/react-form
Install any form validator of your choice. [Optional]
App Router integration
Let's start by creating a formOption that we'll use to share the form's shape across the client and server.

typescript

// shared-code.ts
// Notice the import path is different from the client
import { formOptions } from '@tanstack/react-form/nextjs'

// You can pass other form options here
export const formOpts = formOptions({
defaultValues: {
firstName: '',
age: 0,
},
})
Next, we can create a React Server Action that will handle the form submission on the server.

typescript

// action.ts
'use server'

// Notice the import path is different from the client
import {
ServerValidateError,
createServerValidate,
} from '@tanstack/react-form/nextjs'
import { formOpts } from './shared-code'

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
...formOpts,
onServerValidate: ({ value }) => {
if (value.age < 12) {
return 'Server validation: You must be at least 12 to sign up'
}
},
})

export default async function someAction(prev: unknown, formData: FormData) {
try {
const validatedData = await serverValidate(formData)
console.log('validatedData', validatedData)
// Persist the form data to the database
// await sql`    //   INSERT INTO users (name, email, password)
    //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
    //`
} catch (e) {
if (e instanceof ServerValidateError) {
return e.formState
}

    // Some other error occurred while validating your form
    throw e

}

// Your form has successfully validated!
}
Finally, we'll use someAction in our client-side form component.

tsx

// client-component.tsx
'use client'

import { useActionState } from 'react'
import { initialFormState } from '@tanstack/react-form/nextjs'
// Notice the import is from `react-form`, not `react-form/nextjs`
import {
mergeForm,
useForm,
useStore,
useTransform,
} from '@tanstack/react-form'
import someAction from './action'
import { formOpts } from './shared-code'

export const ClientComp = () => {
const [state, action] = useActionState(someAction, initialFormState)

const form = useForm({
...formOpts,
transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
})

const formErrors = useStore(form.store, (formState) => formState.errors)

return (

<form action={action as never} onSubmit={() => form.handleSubmit()}>
{formErrors.map((error) => (
<p key={error as string}>{error}</p>
))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>

)
}
Here, we're using React's useActionState hook and TanStack Form's useTransform hook to merge state returned from the server action with the form state.

If you get the following error in your Next.js application:

typescript

x You're importing a component that needs `useState`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive.
This is because you're not importing server-side code from @tanstack/react-form/nextjs. Ensure you're importing the correct module based on the environment.

This is a limitation of Next.js. Other meta-frameworks will likely not have this same problem.

Using TanStack Form in Remix
Before reading this section, it's suggested you understand how Remix actions work. Check out Remix's docs for more information

Remix Prerequisites
Start a new Remix project, following the steps in the Remix Documentation.
Install @tanstack/react-form
Install any form validator of your choice. [Optional]
Remix integration
Let's start by creating a formOption that we'll use to share the form's shape across the client and server.

typescript

// routes/\_index/route.tsx
import { formOptions } from '@tanstack/react-form/remix'

// You can pass other form options here
export const formOpts = formOptions({
defaultValues: {
firstName: '',
age: 0,
},
})
Next, we can create an action that will handle the form submission on the server.

tsx

// routes/\_index/route.tsx

import {
ServerValidateError,
createServerValidate,
formOptions,
} from '@tanstack/react-form/remix'

import type { ActionFunctionArgs } from '@remix-run/node'

// export const formOpts = formOptions({

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
...formOpts,
onServerValidate: ({ value }) => {
if (value.age < 12) {
return 'Server validation: You must be at least 12 to sign up'
}
},
})

export async function action({ request }: ActionFunctionArgs) {
const formData = await request.formData()
try {
const validatedData = await serverValidate(formData)
console.log('validatedData', validatedData)
// Persist the form data to the database
// await sql`    //   INSERT INTO users (name, email, password)
    //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
    //`
} catch (e) {
if (e instanceof ServerValidateError) {
return e.formState
}

    // Some other error occurred while validating your form
    throw e

}

// Your form has successfully validated!
}
Finally, the action will be called when the form submits.

tsx

// routes/\_index/route.tsx
import { Form, useActionData } from '@remix-run/react'

import {
mergeForm,
useForm,
useStore,
useTransform,
} from '@tanstack/react-form'
import {
ServerValidateError,
createServerValidate,
formOptions,
initialFormState,
} from '@tanstack/react-form/remix'

import type { ActionFunctionArgs } from '@remix-run/node'

// export const formOpts = formOptions({

// const serverValidate = createServerValidate({

// export async function action({request}: ActionFunctionArgs) {

export default function Index() {
const actionData = useActionData<typeof action>()

const form = useForm({
...formOpts,
transform: useTransform(
(baseForm) => mergeForm(baseForm, actionData ?? initialFormState),
[actionData],
),
})

const formErrors = useStore(form.store, (formState) => formState.errors)

return (

<Form method="post" onSubmit={() => form.handleSubmit()}>
{formErrors.map((error) => (
<p key={error as string}>{error}</p>
))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </Form>

)
}
Here, we're using Remix's useActionData hook and TanStack Form's useTransform hook to merge state returned from the server action with the form state.

# NextUI
