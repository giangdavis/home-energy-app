// Card.jsx

export function Card({ children, className = "" }) {
    return (
      <div className={`rounded-lg border border-gray-700 bg-app-dark p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = "" }) {
    return (
      <div className={`border-b border-gray-700 pb-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`space-y-4 ${className}`}>{children}</div>;
  }
  
  export function CardDescription({ children, className = "" }) {
    return <p className={`text-sm text-gray-400 ${className}`}>{children}</p>;
  }
  
  export function CardFooter({ children, className = "" }) {
    return <div className={`pt-4 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return <h2 className={`text-lg font-semibold text-white ${className}`}>{children}</h2>;
  }
  