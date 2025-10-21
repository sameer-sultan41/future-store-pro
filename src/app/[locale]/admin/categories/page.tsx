"use client";

import { useEffect, useState } from "react";

import { TGetAllCategories, getAllCategories } from "@/actions/category/category";
import AddCategoryGroup from "@/domains/admin/components/category/addCategoryGroup";
import CatGroupRow from "@/domains/admin/components/category/rowGroup";

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
    <div className="flex flex-col">
      <div className="w-full mt-3 flex gap-4 items-center">
        <h3 className="text-xl font-light text-gray-600">Add a main group:</h3>
        <AddCategoryGroup onReset={getData} />
      </div>
      <div className="mt-6">
        {groups.length > 0 &&
          groups.map((group) => (
            <div className="mb-8 rounded-lg border border-gray-200" key={group.id}>
              <CatGroupRow onReset={getData} data={group} categories={categories} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminCategories;
