import React from 'react';
import { Field, ErrorMessage } from 'formik';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required = false,
  options = null,
  disabled = false
}) => {
  const baseInputClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out";
  
  const stateClasses = disabled 
    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed shadow-inner" 
    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-200 placeholder-gray-400 hover:border-gray-400 shadow-sm";

  const inputClasses = `${baseInputClasses} ${stateClasses}`;
  
  const ErrorMessageWithIcon = ({ children }) => (
    <div className="text-red-600 text-sm mt-2 flex items-start">
      <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </div>
  );

  if (type === 'select' && options) {
    return (
      <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          as="select"
          name={name}
          disabled={disabled}
          className={`${inputClasses} cursor-pointer appearance-none bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+")] bg-no-repeat bg-[center_right_1rem] bg-[length:16px_16px] pr-10`}
        >
          <option value="" className="text-gray-400">Select {label}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-gray-900"
            >
              {option.label}
            </option>
          ))}
        </Field>
        <ErrorMessage name={name} component={ErrorMessageWithIcon} />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          as="textarea"
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`${inputClasses} resize-vertical min-h-[100px]`}
        />
        <ErrorMessage name={name} component={ErrorMessageWithIcon} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      <ErrorMessage name={name} component={ErrorMessageWithIcon} />
    </div>
  );
};

export default FormInput;