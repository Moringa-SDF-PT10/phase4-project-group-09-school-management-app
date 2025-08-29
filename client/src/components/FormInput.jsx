import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required = false,
  options = null,
  disabled = false,
  helperText = null,
  showSuccess = false,
  className = ''
}) => {
  const baseInputClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 font-normal";
  
  const stateClasses = disabled 
    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed" 
    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-200 placeholder-gray-400";

  const inputClasses = `${baseInputClasses} ${stateClasses} ${className}`;
  
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Field
            as="select"
            name={name}
            disabled={disabled}
            className={inputClasses}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      
      case 'textarea':
        return (
          <Field
            as="textarea"
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            className={inputClasses}
          />
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center space-x-3">
            <Field
              type="checkbox"
              name={name}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        );
      
      default:
        return (
          <Field
            type={type}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderField()}
        <ErrorMessage name={name} component={ErrorMessageWithIcon} />
        {helperText && (
          <p className="text-sm text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {renderField()}
        
        {showSuccess && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      {helperText && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      
      <ErrorMessage name={name} component={ErrorMessageWithIcon} />
    </div>
  );
};

const ErrorMessageWithIcon = ({ children }) => (
  <div className="text-red-600 text-sm mt-2 flex items-center">
    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
    {children}
  </div>
);

export default FormInput;