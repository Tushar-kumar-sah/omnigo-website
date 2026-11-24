import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivacyPolicyView onBackToHome={() => { window.location.href = '/'; }} />
  </StrictMode>
);
