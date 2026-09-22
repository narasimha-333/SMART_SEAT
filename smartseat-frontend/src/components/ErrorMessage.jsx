import { getErrorMessage } from '../services/api.js';

function ErrorMessage({ error, onRetry }) {
    return (
        <div className="state-panel state-error" role="alert">
            <strong>{getErrorMessage(error)}</strong>
            {onRetry && <button className="button button-secondary" type="button" onClick={onRetry}>Try again</button>}
        </div>
    );
}

export default ErrorMessage;
