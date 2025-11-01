"use client";

interface CustomerData {
    city: string;
    count: number;
    color: string;
}

interface AllCustomersProps {
    totalCustomers: number;
    data: CustomerData[];
}

const AllCustomers = ({ totalCustomers, data }: AllCustomersProps) => {
    const maxCount = Math.max(...data.map((d) => d.count));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    All Customers
                </h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {totalCustomers.toLocaleString()}
                </p>
            </div>

            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentage = (item.count / maxCount) * 100;

                    return (
                        <div key={index} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {item.city}
                                </span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {item.count.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllCustomers;

