
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  icon?: ReactNode;
  buttonText?: string;
  buttonLink?: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  recommended = false,
  icon,
  buttonText = "Get Started",
  buttonLink = "#"
}: PricingCardProps) => {
  return (
    <Card className={`h-full flex flex-col ${
      recommended 
        ? 'border-2 border-ai-purple shadow-lg shadow-ai-purple/20' 
        : 'border border-gray-200 dark:border-gray-800'
    }`}>
      {recommended && (
        <div className="bg-ai-purple text-white text-xs font-medium py-1 px-3 rounded-b-lg mx-auto">
          Recommended
        </div>
      )}
      <CardHeader>
        {icon && <div className="mb-3">{icon}</div>}
        <CardTitle className="text-xl flex items-center justify-between">
          {title}
        </CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Custom' && <span className="text-muted-foreground ml-1">/month</span>}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-ai-purple mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${
            recommended 
              ? 'bg-ai-purple hover:bg-ai-deep-purple text-white' 
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100'
          }`}
          asChild
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
