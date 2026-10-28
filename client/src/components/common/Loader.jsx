export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-32'}`}
      role="status"
      aria-label="Loading"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}
