import { css, unsafeCSS } from 'lit';
import tailwindText from '../../assets/css/index.css?inline';

// Convertimos el string de CSS en un CSSResult de Lit
export const tailwindStyles = css`${unsafeCSS(tailwindText)}`;