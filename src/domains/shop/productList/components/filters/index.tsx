import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/styling";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const brands = [
  { id: "b497558c-26f2-4f08-805a-8f96b3e9f717", name: "Apple" },
  { id: "2575786c-1911-4e00-af49-5b9c3040fc6b", name: "Samsung" },
];

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availability, setAvailability] = useState(searchParams.get("availability") || "all");
  const [priceFrom, setPriceFrom] = useState(Number(searchParams.get("priceFrom")) || 0);
  const [priceTo, setPriceTo] = useState(Number(searchParams.get("priceTo")) || 100000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.getAll("brand"));

  // For slider sync
  const [sliderValue, setSliderValue] = useState<[number, number]>([priceFrom, priceTo]);

  const handleBrandChange = (id: string) => {
    setSelectedBrands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue([value[0], value[1]] as [number, number]);
    setPriceFrom(value[0]);
    setPriceTo(value[1]);
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (availability !== "all") params.set("availability", availability);
    params.set("priceFrom", priceFrom.toString());
    params.set("priceTo", priceTo.toString());
    selectedBrands.forEach((b) => params.append("brand", b));
    router.replace(`?${params.toString()}`);
  };

  return (
    <aside
      className={cn(
        "min-w-[280px] max-w-xs bg-white/80 rounded-xl shadow-lg border border-gray-200 px-6 py-6 sticky top-6 h-fit",
        "flex flex-col gap-8"
      )}
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Filters</h2>

      {/* Availability */}
      <section>
        <h3 className="text-base font-medium text-gray-800 mb-3">Availability</h3>
        <RadioGroup value={availability} onValueChange={setAvailability} className="flex flex-col gap-2 px-1">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="inStock" id="inStock" />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="outStock" id="outStock" />
            <Label htmlFor="outStock">Out of Stock</Label>
          </div>
        </RadioGroup>
      </section>

      {/* Price */}
      <section>
        <h3 className="text-base font-medium text-gray-800 mb-3">Price</h3>
        <div className="flex flex-col gap-3 px-1">
          <Slider min={0} max={100} step={1} value={sliderValue} onValueChange={handleSliderChange} className="mb-2" />
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Label className="block mb-1" htmlFor="priceFrom">
                From
              </Label>
              <Input
                id="priceFrom"
                type="number"
                min={0}
                max={priceTo}
                value={priceFrom}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceTo);
                  setPriceFrom(val);
                  setSliderValue([val, priceTo]);
                }}
                placeholder="Min"
              />
            </div>
            <span className="mx-1 text-gray-400">-</span>
            <div className="flex-1">
              <Label className="block mb-1" htmlFor="priceTo">
                To
              </Label>
              <Input
                id="priceTo"
                type="number"
                min={priceFrom}
                max={priceTo}
                value={priceTo}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceFrom);
                  setPriceTo(val);
                  setSliderValue([priceFrom, val]);
                }}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section>
        <h3 className="text-base font-medium text-gray-800 mb-3">Brands</h3>
        <div className="flex flex-col gap-2 px-1 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <Label htmlFor={brand.id} key={brand.id} className="cursor-pointer">
              <Checkbox
                id={brand.id}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => handleBrandChange(brand.id)}
              />
              <span className="ml-2">{brand.name}</span>
            </Label>
          ))}
        </div>
      </section>

      <Button variant="default" size="lg" className="mt-2 w-full shadow-md" onClick={handleApply}>
        Apply Filters
      </Button>
    </aside>
  );
};

export default Filters;
