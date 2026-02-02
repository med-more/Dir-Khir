'use client';

import { useEffect } from 'react';

/**
 * Composant pour supprimer les attributs ajoutés par les extensions de navigateur
 * qui causent des erreurs d'hydratation
 */
export function SuppressHydration() {
  useEffect(() => {
    // Supprimer les attributs ajoutés par les extensions de navigateur
    if (typeof document !== 'undefined') {
      const body = document.body;
      
      // Supprimer les attributs data-* ajoutés par les extensions
      const attributesToRemove = [
        'data-demoway-document-id',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
      ];
      
      attributesToRemove.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    }
  }, []);

  return null;
}
