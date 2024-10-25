export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="animate-pulse">
        <div className="w-full h-[60vh] bg-gray-300 rounded-lg mb-4" />
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-300 rounded w-full mb-2" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
      </div>
    </div>
  );
}
