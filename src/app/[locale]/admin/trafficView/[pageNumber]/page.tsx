"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, Trash2, Calendar, Monitor, Tag } from "lucide-react";

import { TTrafficListItem, deleteTraffic, getTrafficReport } from "@/actions/pageVisit/pageVisitServices";
import EmptyState from "@/domains/admin/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { SK_Box } from "@/shared/components/UI/skeleton";
import { Pagination } from "@/shared/components/UI/table/pagination";
import { TRAFFIC_LIST_PAGE_SIZE } from "@/shared/constants/admin/trafficView";
import { getFullTimeString } from "@/shared/utils/formatting/time";
import { cn } from "@/shared/utils/styling";
import { calculateTablePagination } from "@/shared/utils/tablesCalculation";

const TrafficView = () => {
  const [trafficList, setTrafficList] = useState<TTrafficListItem[]>([]);
  const { pageNumber } = useParams<{ pageNumber: string }>();
  const pageNumberInt = Number(pageNumber);

  const [totalNumber, setTotalNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getTraffic = useCallback(async () => {
    setIsLoading(true);

    const currentPage = Number(pageNumber);

    if (isNaN(currentPage)) {
      setIsLoading(false);
      throw new Error("Page number is not valid");
    }

    const response = await getTrafficReport((currentPage - 1) * 20);

    if (response.error) {
      setIsLoading(false);
      throw new Error(response.error);
    }

    if (response?.res?.list && response?.res?.totalCount) {
      setTrafficList(response.res.list);
      setTotalNumber(response.res.totalCount);
    }

    setIsLoading(false);
  }, [pageNumber]);

  useEffect(() => {
    getTraffic();
  }, [getTraffic]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const response = await deleteTraffic(id);

    if (response.res) {
      getTraffic();
    }

    setDeletingId(null);
  };

  const paginationList = calculateTablePagination(totalNumber, pageNumberInt, TRAFFIC_LIST_PAGE_SIZE, 10);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
            <span className="text-sm font-medium">Total Visits: </span>
            <span className="text-lg font-bold">{totalNumber || 0}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : trafficList.length ? (
        <div className="space-y-3">
          {trafficList.map((item) => (
            <div
              key={item.id}
              className="group flex flex-wrap items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-2 min-w-[180px]">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  {item.time ? getFullTimeString(item.time) : ""}
                </span>
              </div>

              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium">
                {item.pageType}
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {item.pagePath}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {item.deviceResolution}
                </span>
              </div>

              {item.product && (
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {item.product?.category.name} / {item.product?.name}
                  </span>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className={cn(
                  "ml-auto hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500",
                  { "opacity-50": deletingId === item.id }
                )}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <div className="mt-6">
            <Pagination currentPage={pageNumberInt} routeBase="/admin/trafficView/" pagesList={paginationList} />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="No traffic data yet"
          description="Traffic analytics will appear here once visitors start browsing your store"
        />
      )}
    </div>
  );
};

export default TrafficView;
