import { useState } from 'react';

function ImageWithFallback({ src, alt, className = '' }) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return <div className={`${className} image-fallback`} role="img" aria-label={alt}><span>SS</span></div>;
    }

    return <img className={className} src={src} alt={alt} onError={() => setHasError(true)} />;
}

export default ImageWithFallback;
