"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState, TCartState } from "@/store/shoppingCart";
import { calculateShippingRate, ShippingRate } from "@/actions/shipping/shippingService";

const CheckoutPage = () => {
  const router = useRouter();

  const cartItems: TCartState | undefined = useSelector((state: RootState) => state.cart);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingCost, setShippingCost] = useState(15.0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [availableShippingRates, setAvailableShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { number: 1, title: "Shipping", icon: "📦" },
    { number: 2, title: "Payment", icon: "💳" },
    { number: 3, title: "Review", icon: "✓" },
  ];

  // Calculate shipping when address is complete
  useEffect(() => {
    const calculateShipping = async () => {
      if (
        formData.address &&
        formData.city &&
        formData.state &&
        formData.zipCode &&
        formData.country &&
        cartItems.items &&
        cartItems.items.length > 0
      ) {
        setIsCalculatingShipping(true);
        try {
          const shippingAddress = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          };

          const cartItemsForShipping = cartItems.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.dealPrice || item.price || 0,
            quantity: item.quantity,
          }));

          const result = await calculateShippingRate(shippingAddress, cartItemsForShipping);
          console.log("result>>", result);

          if (result.success && result.rates && result.rates.length > 0) {
            setAvailableShippingRates(result.rates);
            // Sort rates by price and select the cheapest by default
            const sortedRates = [...result.rates].sort((a, b) => a.rate - b.rate);
            setSelectedShippingRate(sortedRates[0]);
            setShippingCost(sortedRates[0].rate);
          } else if (result.defaultRate) {
            // Use default rate if API fails
            setShippingCost(result.defaultRate);
            setAvailableShippingRates([]);
            setSelectedShippingRate(null);
          }
        } catch (error) {
          console.error("Error calculating shipping:", error);
          // Keep default shipping cost on error
          setShippingCost(15.0);
        } finally {
          setIsCalculatingShipping(false);
        }
      }
    };

    calculateShipping();
  }, [formData.address, formData.city, formData.state, formData.zipCode, formData.country, cartItems.items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.address &&
        formData.city &&
        formData.state &&
        formData.zipCode &&
        formData.country
      );
    }
    if (step === 2) {
      if (formData.paymentMethod === "card") {
        return formData.cardNumber && formData.cardName && formData.expiryDate && formData.cvv;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate totals
  const subtotal =
    cartItems.items?.reduce((total, item) => {
      const itemPrice = item.dealPrice || item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0) || 0;

  const shipping = shippingCost;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);

      // Generate order data
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orderDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const orderData = {
        orderNumber,
        orderDate,
        estimatedDelivery,
        total: total.toFixed(2),
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items:
          cartItems.items?.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            imgUrl: item.imgUrl,
            price: item.dealPrice || item.price || 0,
            quantity: item.quantity,
          })) || [],
      };

      // Navigate to order confirmation page with order data
      const orderDataString = encodeURIComponent(JSON.stringify(orderData));
      router.push(`/order-confirmation?orderData=${orderDataString}`);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                <p className="text-sm text-gray-500">Where should we deliver your order?</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div className="group">
                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                />
              </div>

              <div className="group">
                <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                />
              </div>

              <div className="group">
                <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Street Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="group">
                  <Label htmlFor="city" className="text-gray-700 font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="state" className="text-gray-700 font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="group">
                  <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="country" className="text-gray-700 font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Options Section */}
              {isCalculatingShipping && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-sm font-medium text-blue-900">Calculating shipping rates...</p>
                  </div>
                </div>
              )}

              {!isCalculatingShipping && availableShippingRates.length > 0 && (
                <div className="mt-6">
                  <Label className="text-gray-700 font-medium mb-3 block">Select Shipping Method</Label>
                  <div className="space-y-3">
                    {availableShippingRates.map((rate, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedShippingRate(rate);
                          setShippingCost(rate.rate);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedShippingRate === rate
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedShippingRate === rate
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {selectedShippingRate === rate && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <circle cx="6" cy="6" r="3" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {rate.provider} - {rate.serviceName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Estimated delivery: {rate.deliveryDays} business day{rate.deliveryDays !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${rate.rate.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{rate.currency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isCalculatingShipping && availableShippingRates.length === 0 && formData.zipCode && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Using standard shipping rate</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Dynamic shipping rates unavailable. Standard rate of ${shippingCost.toFixed(2)} applied.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                <p className="text-sm text-gray-500">Choose your preferred payment option</p>
              </div>
            </div>

            <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
              <div className="space-y-3">
                <div
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePaymentMethodChange("card")}
                >
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === "paypal"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePaymentMethodChange("paypal")}
                >
                  <RadioGroupItem value="paypal" id="paypal" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.154a.804.804 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">PayPal</p>
                      <p className="text-xs text-gray-500">Fast & secure payment</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === "cod"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePaymentMethodChange("cod")}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive</p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {formData.paymentMethod === "card" && (
              <div className="mt-6 space-y-5 animate-in fade-in duration-300">
                <div className="group">
                  <Label htmlFor="cardNumber" className="text-gray-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>

                <div className="group">
                  <Label htmlFor="cardName" className="text-gray-700 font-medium">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="group">
                    <Label htmlFor="expiryDate" className="text-gray-700 font-medium">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="group">
                    <Label htmlFor="cvv" className="text-gray-700 font-medium">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={3}
                      required
                      className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === "paypal" && (
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-gray-800 font-medium">
                    You will be redirected to PayPal to complete your purchase securely.
                  </p>
                </div>
              </div>
            )}

            {formData.paymentMethod === "cod" && (
              <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-gray-800 font-medium">
                    Pay with cash upon delivery. Please keep exact change ready.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                <p className="text-sm text-gray-500">Please review your information before placing the order</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Shipping Info Review */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                  <p>{formData.country}</p>
                  <p className="mt-2">📧 {formData.email}</p>
                  <p>📞 {formData.phone}</p>
                </div>
              </div>

              {/* Payment Info Review */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                <div className="text-sm text-gray-700">
                  {formData.paymentMethod === "card" && (
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-gray-600">**** **** **** {formData.cardNumber.slice(-4)}</p>
                    </div>
                  )}
                  {formData.paymentMethod === "paypal" && <p className="font-medium">PayPal</p>}
                  {formData.paymentMethod === "cod" && <p className="font-medium">Cash on Delivery</p>}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Order Items ({cartItems.items?.length || 0})
                </h3>
                <div className="space-y-2">
                  {cartItems.items?.map((item) => {
                    const itemPrice = item.dealPrice || item.price || 0;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">${(itemPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Complete your purchase in just a few steps</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
                        : currentStep === step.number
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-medium ${
                      currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Step Content */}
          <div className="lg:col-span-2">
            <div className="animate-in fade-in slide-in-from-right duration-500">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Next
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing || !cartItems.items?.length}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto">
                {cartItems.items && cartItems.items.length > 0 ? (
                  cartItems.items.map((item) => {
                    const itemPrice = item.dealPrice || item.price || 0;
                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-start p-2 rounded-lg bg-white border border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">${(itemPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Your cart is empty</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-600">Shipping</span>
                  {isCalculatingShipping ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-3 w-3 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-blue-600 font-semibold text-xs">Calculating...</span>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-semibold">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900 font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Secure SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
