import { useState, useCallback } from "react";
import type { ProductFormData, FormErrors } from "@/types/product";
import { validateForm, validateField } from "@/utils/productValidation";

export const useProductForm = (initialData: ProductFormData) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }

      // Real-time validation for specific fields
      const fieldError = validateField(field, value);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError,
        }));
      }
    },
    [errors]
  );

  const validateFormData = useCallback(() => {
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [formData]);

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  const addError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    validateFormData,
    setSubmitting,
    addError,
    clearErrors,
  };
};
