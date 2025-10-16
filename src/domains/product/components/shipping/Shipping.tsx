import React from "react";

const Shipping = ({
  productInfo,
  shippingRates,
  loadingShipping,
  shippingError,
  selectedShippingMethod,
  setSelectedShippingMethod,
}: any) => {
  return (
    <>
      {productInfo && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Shipping Options</h3>

          {/* Shipping Error Message */}
          {shippingError && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-800">⚠️ {shippingError}. Showing estimated rates.</p>
            </div>
          )}

          {/* Loading State */}
          {loadingShipping ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {shippingRates.map((shipping: any) => (
                <button
                  key={shipping.serviceType}
                  onClick={() => setSelectedShippingMethod(shipping.serviceType)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedShippingMethod === shipping.serviceType
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedShippingMethod === shipping.serviceType ? "border-gray-900" : "border-gray-300"
                      }`}
                    >
                      {selectedShippingMethod === shipping.serviceType && (
                        <div className="w-3 h-3 rounded-full bg-gray-900" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {shipping.serviceName}
                        {shipping.carrierName && shipping.carrierName !== shipping.serviceName && (
                          <span className="text-xs text-gray-500 ml-1">({shipping.carrierName})</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{shipping.estimatedDays}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {shipping.cost === 0 ? (
                      <span className="text-sm font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">
                        {shipping.currency} {shipping.cost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Total Price with Shipping */}
          {/* {!loadingShipping && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Product Price:</span>
                <span className="font-medium text-gray-900">
                  {selectedShipping?.currency || "PKR"} {finalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className={`font-medium ${selectedShipping?.cost === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {selectedShipping?.cost === 0
                    ? "FREE"
                    : `${selectedShipping?.currency || "PKR"} ${selectedShipping?.cost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {selectedShipping?.currency || "PKR"}{" "}
                    {((finalPrice || 0) + (selectedShipping?.cost || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )} */}
        </div>
      )}
    </>
  );
};

export default Shipping;
