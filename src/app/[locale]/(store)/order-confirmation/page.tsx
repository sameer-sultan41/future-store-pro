"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface OrderItem {
  productId: string;
  productName: string;
  imgUrl: string;
  price: number;
  quantity: number;
}

interface OrderData {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  total: string;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
}

const OrderConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Get order data from URL params
    const orderDataParam = searchParams.get("orderData");
    if (orderDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(orderDataParam));
        setOrderData(parsedData);
      } catch (error) {
        console.error("Error parsing order data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-2 h-2 ${
                  ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"][
                    Math.floor(Math.random() * 6)
                  ]
                }`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-4 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order is being processed.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-6 animate-in slide-in-from-bottom duration-700">
          {/* Order Number Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border-2 border-blue-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-xl font-bold text-gray-900">{orderData.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">{orderData.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="text-lg font-semibold text-green-600">{orderData.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Order Tracking
            </h3>
            <div className="relative" role="list" aria-label="Order tracking progress: 2 of 4 steps completed">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true"></div>

              {/* Step 1 - Completed */}
              <div className="relative flex items-start mb-6 pl-12" role="listitem">
                <div
                  className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  aria-label="Completed"
                >
                  <span className="sr-only">Step 1 of 4: Completed</span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-500">Your order has been received and confirmed</p>
                  <p className="text-xs text-green-600 mt-1">
                    <span aria-hidden="true">✓</span> Completed - {orderData.orderDate}
                  </p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="relative flex items-start mb-6 pl-12" role="listitem">
                <div
                  className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
                  aria-label="In progress"
                >
                  <span className="sr-only">Step 2 of 4: In Progress</span>
                  <div className="w-3 h-3 bg-white rounded-full" aria-hidden="true"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Processing</p>
                  <p className="text-sm text-gray-500">We're preparing your items for shipment</p>
                  <p className="text-xs text-blue-600 mt-1">
                    <span aria-hidden="true">●</span> In Progress
                  </p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="relative flex items-start mb-6 pl-12" role="listitem">
                <div
                  className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                  aria-label="Pending"
                >
                  <span className="sr-only">Step 3 of 4: Pending</span>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Shipped</p>
                  <p className="text-sm text-gray-500">Your order will be shipped soon</p>
                </div>
              </div>

              {/* Step 4 - Pending */}
              <div className="relative flex items-start pl-12" role="listitem">
                <div
                  className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                  aria-label="Pending"
                >
                  <span className="sr-only">Step 4 of 4: Pending</span>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Delivered</p>
                  <p className="text-sm text-gray-500">Expected by {orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Shipping Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900">
                {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
              </p>
              <p className="text-gray-700">{orderData.shippingAddress.address}</p>
              <p className="text-gray-700">
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
              </p>
              <p className="text-gray-700">{orderData.shippingAddress.country}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">📧 {orderData.shippingAddress.email}</p>
                <p className="text-sm text-gray-600">📞 {orderData.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              Payment Method
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 capitalize">{orderData.paymentMethod.replace("-", " ")}</p>
              {orderData.paymentMethod === "card" && (
                <p className="text-sm text-gray-600">Payment processed successfully</p>
              )}
              {orderData.paymentMethod === "paypal" && (
                <p className="text-sm text-gray-600">PayPal transaction completed</p>
              )}
              {orderData.paymentMethod === "cod" && (
                <p className="text-sm text-gray-600">Please keep cash ready for delivery</p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Order Items ({orderData.items.length})
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {item.imgUrl ? (
                      <img src={item.imgUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Amount</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${orderData.total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom duration-1000">
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Continue Shopping
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-6 rounded-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Receipt
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center bg-white rounded-xl p-6 shadow-md border border-gray-200 animate-in fade-in duration-1200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, feel free to contact our customer support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Contact Support
            </Link>
            <Link
              href="/track-order"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Track Order
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmationPage;
