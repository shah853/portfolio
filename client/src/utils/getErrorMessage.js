const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function getErrorMessage(error) {
  if (!error?.response) {
    return `Server se connect nahi ho paya. Backend chal raha hai? (${apiBaseUrl})`;
  }

  return (
    error.response.data?.message ||
    error.response.data?.errors?.[0]?.msg ||
    'Something went wrong'
  );
}
