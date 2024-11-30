
const Skeleton = ({ className }) => {
    return (
      <div className={`animate-pulse bg-gray-300 rounded ${className}`}>
        {/* You can adjust the number of skeleton items according to your layout */}
        <div className="h-8 w-full mb-4"></div>
        <div className="h-6 w-3/4 mb-4"></div>
        <div className="h-6 w-1/2 mb-4"></div>
        <div className="h-6 w-3/4 mb-4"></div>
        <div className="h-6 w-1/3 mb-4"></div>
        <div className="h-6 w-full mb-4"></div>
        <div className="h-6 w-full mb-4"></div>
      </div>
    );
  };
  
  export default Skeleton;
  