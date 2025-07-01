const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
