import { useEffect, useCallback } from 'react';
import type { ProductFormData } from '@/types/product';

const AUTO_SAVE_KEY = 'product_form_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = (formData: ProductFormData, isSubmitting: boolean) => {
  // Save to localStorage
  const saveDraft = useCallback(() => {
    if (isSubmitting) return;
    
    const draft = {
      ...formData,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(draft));
  }, [formData, isSubmitting]);

  // Load from localStorage
  const loadDraft = useCallback((): ProductFormData | null => {
    try {
      const saved = localStorage.getItem(AUTO_SAVE_KEY);
      if (!saved) return null;
      
      const draft = JSON.parse(saved);
      
      // Check if draft is less than 24 hours old
      if (Date.now() - draft.timestamp > 24 * 60 * 60 * 1000) {
        clearDraft();
        return null;
      }
      
      // Remove timestamp before returning
      const { timestamp, ...formData } = draft;
      return formData;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, []);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(AUTO_SAVE_KEY);
  }, []);

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveDraft]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveDraft();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveDraft]);

  return { saveDraft, loadDraft, clearDraft };
};