function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          Entre Amigas
        </h1>
        <p className="text-gray-600 text-lg">
          Comunidad para mujeres migrantes de habla hispana en Canadá
        </p>
        <div className="mt-8 space-x-4">
          <span className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-md">
            ⚛️ React 18.3.1
          </span>
          <span className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-800 rounded-md">
            ⚡ Vite 5.4
          </span>
          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
            🎨 Tailwind CSS 3.4
          </span>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Frontend configurado correctamente ✓
        </p>
      </div>
    </div>
  );
}

export default App;
