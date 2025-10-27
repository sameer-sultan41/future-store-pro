"use client";

import { useEffect, useState } from "react";
import { FolderTree } from "lucide-react";

import { TGetAllCategories, getAllCategories } from "@/actions/category/category";
import AddCategoryGroup from "@/domains/admin/components/category/addCategoryGroup";
import CatGroupRow from "@/domains/admin/components/category/rowGroup";
import EmptyState from "@/domains/admin/components/common/EmptyState";

const fakeCategories: TGetAllCategories[] = [
  {
    id: "1",
    name: "Electronics",
    parentID: null,
    url: "/electronics",
    iconSize: [32, 32],
    iconUrl: "https://example.com/electronics-icon.png",
  },
  {
    id: "2",
    name: "Clothing",
    parentID: null,
    url: "/clothing",
    iconSize: [32, 32],
    iconUrl: "https://example.com/clothing-icon.png",
  },
  {
    id: "3",
    name: "Phones",
    parentID: "1",
    url: "/electronics/phones",
    iconSize: [32, 32],
    iconUrl: "https://example.com/phones-icon.png",
  },
  {
    id: "4",
    name: "Laptops",
    parentID: "1",
    url: "/electronics/laptops",
    iconSize: [32, 32],
    iconUrl: "https://example.com/laptops-icon.png",
  },
  {
    id: "5",
    name: "Men",
    parentID: "2",
    url: "/clothing/men",
    iconSize: [32, 32],
    iconUrl: "https://example.com/men-icon.png",
  },
  {
    id: "6",
    name: "Women",
    parentID: "2",
    url: "/clothing/women",
    iconSize: [32, 32],
    iconUrl: "https://example.com/women-icon.png",
  },
];
const AdminCategories = () => {
  const [allCategories, setAllCategories] = useState<TGetAllCategories[]>([]);

  const getData = async () => {
    const data = { res: fakeCategories };
    if (data.res) setAllCategories(data.res);
  };

  useEffect(() => {
    getData();
  }, []);

  const groups: TGetAllCategories[] = [];
  const categories: TGetAllCategories[] = [];

  if (allCategories.length > 0) {
    allCategories.forEach((cat) => {
      if (cat.parentID) {
        categories.push(cat);
        return;
      }

      groups.push(cat);
    });
  }
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex gap-4 items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Add Main Category:</h3>
        <AddCategoryGroup onReset={getData} />
      </div>

      {groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              key={group.id}
            >
              <CatGroupRow onReset={getData} data={group} categories={categories} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Create your first main category to organize your products"
        />
      )}
    </div>
  );
};

export default AdminCategories;
