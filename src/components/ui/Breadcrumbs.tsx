import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-default-600 mb-6 animate-fade-in ${className}`}>
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
      >
        🏠 Home
      </Link>
      
      {items.map((item) => (
        <div key={item.label} className="flex items-center">
          <span className="mx-2 text-default-400">›</span>
          {item.href ? (
            <Link 
              to={item.href}
              className="flex items-center hover:text-primary transition-colors"
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center text-default-800 font-medium">
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
