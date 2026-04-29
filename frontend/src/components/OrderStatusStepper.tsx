import type { OrderStatus } from "../types";

interface Props {
    currentStatus: OrderStatus;
}

const STEPS: OrderStatus[] = [
    "Order Received",
    "Preparing",
    "Out for Delivery",
    "Delivered",
];

const ICONS: Record<OrderStatus, string> = {
    "Order Received": "🧾",
    "Preparing": "👨‍🍳",
    "Out for Delivery": "🛵",
    "Delivered": "✅",
};

const OrderStatusStepper = ({ currentStatus }: Props) => {
    const currentIndex = STEPS.indexOf(currentStatus);

    return (
        <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="font-semibold mb-6 text-white">Order Status</h3>
            <div className="flex flex-col gap-0">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;

                    return (
                        <div key={step} className="flex gap-4">
                            {/* Indicator column */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors ${isCompleted
                                        ? "bg-orange-500"
                                        : isActive
                                            ? "bg-orange-500 ring-4 ring-orange-500/30"
                                            : "bg-gray-800"
                                        }`}
                                >
                                    {ICONS[step]}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`w-0.5 h-10 transition-colors ${isCompleted ? "bg-orange-500" : "bg-gray-700"
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Label column */}
                            <div className="pb-10 last:pb-0 pt-2">
                                <p
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? "text-orange-400"
                                        : isCompleted
                                            ? "text-white"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {step}
                                </p>
                                {isActive && step !== "Delivered" && (
                                    <p className="text-xs text-gray-500 mt-0.5">In progress...</p>
                                )}
                                {isActive && step === "Delivered" && (
                                    <p className="text-xs text-green-400 mt-0.5">✓ Order delivered!</p>
                                )}
                                {isCompleted && (
                                    <p className="text-xs text-gray-500 mt-0.5">Done</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusStepper;