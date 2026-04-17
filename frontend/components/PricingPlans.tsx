import { Bot, CheckCircle2, ChevronRight, Users } from 'lucide-react';

interface PricingPlansProps {
  onSelectPlan: (members: number) => void;
}

export default function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const plans = [
    { members: 3, price: 29, name: "Starter Team" },
    { members: 7, price: 59, name: "Growth Team" },
    { members: 12, price: 99, name: "Pro Team" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bot className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Luminescent.io</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The unified AI chatbot for your entire team. Powered by Bytez models. Choose your team size and start collaborating.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div key={plan.members} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            {plan.members === 7 && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">${plan.price}</span>
              <span className="text-slate-500 font-medium">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-600">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Up to <strong>{plan.members} team members</strong></span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Access to Bytez AI Models</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Shared Team History</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan(plan.members)}
              className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                plan.members === 7 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              Select Plan <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}