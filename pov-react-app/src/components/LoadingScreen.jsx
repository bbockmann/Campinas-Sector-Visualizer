const LoadingScreen = () => {
    return (
        <div className="loading-wrap">
            <span className="loading-text">waiting on render backend</span>
            <div className="dot-wrap">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
