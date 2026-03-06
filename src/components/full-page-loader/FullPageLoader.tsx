const FullPageLoader = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: '4px solid #ccc',
        borderTop: '4px solid black',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default FullPageLoader;
