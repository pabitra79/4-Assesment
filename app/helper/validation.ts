import Joi from 'joi';

export const categoryValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name must not exceed 100 characters',
      'any.required': 'Category name is required'
    })
});

export const productValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .required()
    .trim()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name must not exceed 200 characters',
      'any.required': 'Product name is required'
    }),
  category: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category is required',
      'any.required': 'Category is required'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .trim()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 2000 characters',
      'any.required': 'Description is required'
    })
});

export const productUpdateValidation = productValidation;