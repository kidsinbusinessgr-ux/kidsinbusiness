import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GlobalTipProps {
  tip: string;
}

const GlobalTip = ({ tip }: GlobalTipProps) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Kids in Business Tip</h4>
          <p className="text-sm text-muted-foreground">{tip}</p>
        </div>
      </div>
    </Card>
  );
};

export default GlobalTip;
