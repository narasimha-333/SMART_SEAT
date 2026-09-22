function LoadingState({ message = 'Loading...' }) {
    return <div className="state-panel"><span className="loading-dot" />{message}</div>;
}

export default LoadingState;
