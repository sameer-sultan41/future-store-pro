"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "@/store/shoppingCart";
import { Card } from "@/components/ui/card";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  // Calculate totals
  const subtotal =
    cartItems.items?.reduce((total, item) => {
      const itemPrice = item.dealPrice || item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0) || 0;

  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Order placed successfully! This is a demo checkout.");
      router.push("/");
    }, 2000);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
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
              <form onSubmit={handleSubmit} className="space-y-5">
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
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
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
                      formData.paymentMethod === "strip"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePaymentMethodChange("strip")}
                  >
                    <RadioGroupItem value="strip" id="strip" />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.154a.804.804 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">strip</p>
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
                        <p className="font-semibold text-gray-900">Easy paisa</p>
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

              {formData.paymentMethod === "strip" && (
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
                      You will be redirected to strip to complete your purchase securely.
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
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-4">
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
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.items && cartItems.items.length > 0 ? (
                  cartItems.items.map((item, index) => {
                    const itemPrice = item.dealPrice || item.price || 0;
                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-start p-3 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">{item.productName}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs text-blue-600 font-medium">${itemPrice.toFixed(2)} each</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-900 ml-3">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </div>

              <Separator className="my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span className="text-gray-600 font-medium">Shipping</span>
                  </div>
                  <span className="text-gray-900 font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600 font-medium">Tax (8%)</span>
                  </div>
                  <span className="text-gray-900 font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isProcessing || !cartItems.items?.length}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Place Order
                  </span>
                )}
              </Button>

              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Money-back guarantee
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
