import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { ExecutionStep } from '../types';

interface ExecutionStepsProps {
  steps: ExecutionStep[];
  currentStepId?: string;
}

const ExecutionSteps: React.FC<ExecutionStepsProps> = ({ steps = [], currentStepId }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const getStepIcon = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-400 animate-pulse" />;
      // case 'error':
      //   return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Execution Steps</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {steps.map((step, index) => (
            step && (
              <div 
                key={step.id}
                className={`relative pl-8 pb-8 ${
                  index === steps.length - 1 ? 'pb-0' : ''
                }`}
              >
                <div className="absolute left-0 top-0">
                  {getStepIcon(step.status)}
                </div>
                
                {index !== steps.length - 1 && (
                  <div 
                    className={`absolute left-2.5 top-6 w-0.5 h-full ${
                      step.status === 'completed' ? 'bg-emerald-400' : 'bg-gray-600'
                    }`}
                  />
                )}
                
                <div 
                  className={`rounded-lg p-4 border transition-all ${
                    step.id.toString() === currentStepId
                      ? 'border-blue-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <h3 className="font-medium text-gray-200">{step.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  {/* <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{
                      new Date(step.timestamp).toLocaleTimeString()
                    }</span>
                  </div> */}
                </div>
              </div>
            )
          ))}
          
          {(!steps || steps.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              No execution steps to display yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionSteps;