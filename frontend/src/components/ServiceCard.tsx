
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  color?: string;
  buttonText?: string;
  buttonLink?: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  features,
  color = "bg-ai-purple",
  buttonText = "Learn More",
  buttonLink = "/services"
}: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 h-full hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <div className={`${color} p-1`} />
      <CardHeader className="pt-6">
        <div className="mb-3 p-3 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className={`w-1.5 h-1.5 rounded-full ${color} mr-2`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className={`w-full group border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple`}
          asChild
        >
          <a href={buttonLink}>
            {buttonText} 
            <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
