"use client";
import { useEffect, useState } from "react";
import { Tags, Plus, Edit2, Trash2 } from "lucide-react";

import { addBrand, deleteBrand, getAllBrands, updateBrand } from "@/actions/brands/brands";
import EmptyState from "@/domains/admin/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import Input from "@/shared/components/UI/input";
import Popup from "@/shared/components/UI/popup";
import { TBrand } from "@/shared/types";


let selectedBrandID = "";
const Brand = () => {
  const [addValue, setAddValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [brandList, setBrandList] = useState<TBrand[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const fetchBrands = async () => {
    const response = await getAllBrands();

    if (response.res) {
      setIsListLoading(false);
      setBrandList(response.res);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = async () => {
    if (addValue !== "") {
      setIsLoading(true);
      const response = await addBrand(addValue);
      if (response.error) {
        setIsLoading(false);
      }
      if (response.res) {
        setIsLoading(false);
        setAddValue("");
        fetchBrands();
      }
    }
  };

  const handleShowEdit = (data: TBrand) => {
    selectedBrandID = data.id;
    setEditValue(data.name);
    setErrorMsg("");
    setShowEdit(true);
  };
  const handleUpdate = async () => {
    if (selectedBrandID !== "" && editValue !== "") {
      setIsLoading(true);
      const response = await updateBrand({
        id: selectedBrandID,
        name: editValue,
      });
      if (response.error) {
        setIsLoading(false);
        setErrorMsg(response.error);
      }
      if (response.res) {
        setIsLoading(false);
        setShowEdit(false);
        fetchBrands();
      }
    }
  };

  const handleShowDelete = (id: string) => {
    selectedBrandID = id;
    setShowDelete(true);
  };
  const handleDelete = async () => {
    if (selectedBrandID !== "") {
      setIsLoading(true);
      const response = await deleteBrand(selectedBrandID);
      if (response.error) {
        setIsLoading(false);
      }
      if (response.res) {
        setIsLoading(false);
        setShowDelete(false);
        fetchBrands();
      }
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex gap-4 items-center mb-6">
          <Input
            type="text"
            className="flex-1 max-w-md"
            placeholder="Enter brand name..."
            value={addValue}
            onChange={(e) => setAddValue(e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button
            disabled={isLoading || !addValue.trim()}
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>

        {isListLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : brandList.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No brands yet"
            description="Add your first brand to get started"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandList.map((brand) => (
              <div
                key={brand.id}
                className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="font-medium text-slate-800 dark:text-white">{brand.name}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowEdit(brand)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowDelete(brand.id)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEdit && (
        <Popup
          width="400px"
          title="Edit Brand Name"
          content={
            <div className="flex flex-col gap-4 py-10 px-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Brand Name:</span>
                <Input
                  className="w-[200px]"
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.currentTarget.value)}
                />
              </div>
              <span>{errorMsg}</span>
            </div>
          }
          isLoading={isLoading}
          onCancel={() => setShowEdit(false)}
          onClose={() => setShowEdit(false)}
          onSubmit={() => handleUpdate()}
          cancelBtnText="No"
          confirmBtnText="Yes"
        />
      )}
      {showDelete && (
        <Popup
          width="300px"
          content={<div className="text-center py-3 pb-6">Are You Sure?</div>}
          isLoading={isLoading}
          onCancel={() => setShowDelete(false)}
          onClose={() => setShowDelete(false)}
          onSubmit={() => handleDelete()}
          cancelBtnText="No"
          confirmBtnText="Yes"
        />
      )}
    </>
  );
};

export default Brand;
