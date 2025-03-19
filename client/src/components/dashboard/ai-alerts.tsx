import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface Alert {
  id: number;
  type: "error" | "warning" | "success";
  title: string;
  description: string;
  time: string;
  actions: {
    primary: string;
    secondary: string;
  };
}

interface AIAlertsProps {
  alerts: Alert[];
  onViewAll: () => void;
  onAction: (id: number, action: "primary" | "secondary") => void;
}

export default function AIAlerts({ alerts, onViewAll, onAction }: AIAlertsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="text-red-500" />;
      case "warning":
        return <AlertTriangle className="text-amber-500" />;
      case "success":
        return <TrendingUp className="text-green-500" />;
      default:
        return <AlertCircle className="text-red-500" />;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading">AI-Generated Alerts</h2>
        <Button variant="link" onClick={onViewAll} className="text-primary text-sm font-medium">View All</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 border-b border-neutral-100 hover:bg-neutral-50 last:border-b-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(alert.type)}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-neutral-800">{alert.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{alert.description}</p>
                  <div className="mt-2 flex">
                    <Button 
                      variant="link" 
                      className="text-xs text-primary font-medium mr-3 h-auto p-0"
                      onClick={() => onAction(alert.id, "primary")}
                    >
                      {alert.actions.primary}
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-xs text-neutral-500 h-auto p-0"
                      onClick={() => onAction(alert.id, "secondary")}
                    >
                      {alert.actions.secondary}
                    </Button>
                  </div>
                </div>
                <div className="ml-auto text-xs text-neutral-400">{alert.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
