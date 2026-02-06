import React, { useState } from 'react';

const RestaurantInvoice = () => {
  // Company Information
  const companyInfo = {
    name: "Deerika",
    gstNumber: "06AAFCD6498P1ZT",
    tollFree: "1800-123-6477",
    cin: "U52100DL2016PTC292777",
    fssaiNo: "10819005000131"
  };

  // Seller Information
  const sellerInfo = {
    name: "DJT Retailers Private Limited",
    address: "1st floor, plot no.m1 m2, Deeplife Tower Sector 51, Gurugram-122018"
  };

  // Customer Information
  const [customerInfo] = useState({
    name: "Aakriti Rathore",
    address: "B-268, west vinod nagar, street no.2, near press apartment bus stand, Patparganj, IP Extension",
    city: "Delhi",
    state: "Delhi",
    stateCode: "07",
    pincode: "110092",
    phone: "0124-1234568"
  });

  // Invoice Details
  const [invoiceDetails] = useState({
    invoiceNumber: "INV-2024-005678",
    invoiceDate: "Thu May 19 3:41PM",
    orderId: "ORD-2024-123456",
    shipmentNumber: 1,
    deliveryEstimate: "Today 4:00 PM - 6:00 PM"
  });

  // Order Items
  const [orderItems] = useState([
    {
      id: 1,
      name: "Milkfood Ghee Tp 980Ml",
      hsnCode: "40590200",
      quantity: 2,
      mrp: 550.00,
      unitPrice: 459.00,
      taxRate: 12
    },
    {
      id: 2,
      name: "Aashirvaad Atta 10Kg",
      hsnCode: "11010000",
      quantity: 1,
      mrp: 480.00,
      unitPrice: 420.00,
      taxRate: 5
    },
    {
      id: 3,
      name: "Tata Salt 1Kg",
      hsnCode: "25010010",
      quantity: 3,
      mrp: 28.00,
      unitPrice: 24.00,
      taxRate: 5
    },
    {
      id: 4,
      name: "Fortune Sunflower Oil 5L",
      hsnCode: "15121110",
      quantity: 1,
      mrp: 750.00,
      unitPrice: 680.00,
      taxRate: 5
    },
    {
      id: 5,
      name: "Amul Butter 500g",
      hsnCode: "04051000",
      quantity: 2,
      mrp: 280.00,
      unitPrice: 260.00,
      taxRate: 12
    }
  ]);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Available Coupons
  const availableCoupons = {
    'SAVE100': { discount: 100, type: 'flat', minOrder: 500 },
    'FIRST20': { discount: 20, type: 'percent', minOrder: 300, maxDiscount: 200 },
    'DEERIKA50': { discount: 50, type: 'flat', minOrder: 400 },
    'GROCERY10': { discount: 10, type: 'percent', minOrder: 200, maxDiscount: 150 }
  };

  // Calculations
  const calculateItemTaxableAmount = (item) => {
    const totalPrice = item.unitPrice * item.quantity;
    return totalPrice / (1 + item.taxRate / 100);
  };

  const calculateItemTax = (item) => {
    const taxableAmount = calculateItemTaxableAmount(item);
    return taxableAmount * (item.taxRate / 100);
  };

  const calculateItemTotal = (item) => {
    return item.unitPrice * item.quantity;
  };

  const calculateMRPTotal = (item) => {
    return item.mrp * item.quantity;
  };

  // Totals
  const subtotal = orderItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const mrpTotal = orderItems.reduce((sum, item) => sum + calculateMRPTotal(item), 0);
  const totalTaxableAmount = orderItems.reduce((sum, item) => sum + calculateItemTaxableAmount(item), 0);
  const totalTax = orderItems.reduce((sum, item) => sum + calculateItemTax(item), 0);
  const totalCGST = totalTax / 2;
  const totalSGST = totalTax / 2;
  const savings = mrpTotal - subtotal;

  // Coupon Discount Calculation
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const coupon = availableCoupons[appliedCoupon];
    if (coupon.type === 'percent') {
      const discount = (subtotal * coupon.discount) / 100;
      return Math.min(discount, coupon.maxDiscount || discount);
    }
    return coupon.discount;
  };

  const couponDiscount = calculateCouponDiscount();
  const membershipCashback = Math.round(subtotal * 0.05); // 5% cashback
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const grandTotal = subtotal - couponDiscount + deliveryCharge;

  // Apply Coupon
  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    setCouponError('');

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (appliedCoupon) {
      setCouponError('A coupon is already applied');
      return;
    }

    const coupon = availableCoupons[code];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order Rs.${coupon.minOrder} required`);
      return;
    }

    setAppliedCoupon(code);
    setCouponCode('');
  };

  // Remove Coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Format Currency
  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      
      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto mb-4 print:hidden flex gap-3">
        <button
          onClick={handlePrint}
          className="bg-[#00bb07] hover:bg-[#009a06] text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
        >
          Print Invoice
        </button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors">
          Download PDF
        </button>
      </div>

      {/* Invoice Container */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        
        {/* ========== HEADER ========== */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-center font-bold text-gray-800 text-lg mb-4">Tax Invoice</h4>
          
          <div className="flex flex-col md:flex-row justify-between gap-6">
            
            {/* Company Info - Left Side */}
            <div className="flex-1 text-left border-l border-r border-gray-200 px-4">
              
              <div className="mb-3">
                <div className="inline-flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#FCBE00] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">D</span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800">TraditionalCare</h2>
                    <p className="text-xs text-[#FCBE00]">A cart Full of Happiness</p>
                  </div>
                </div>
              </div>
              
              <p className="font-bold text-gray-700 text-sm">
                GST TIN : {companyInfo.gstNumber}
              </p>
              <p className="font-bold text-gray-700 text-sm">
                Toll Free No. : <a href={`tel:${companyInfo.tollFree}`} className="text-[#00bb07]">{companyInfo.tollFree}</a>
              </p>
            </div>
            
            {/* Bill To - Right Side */}
            <div className="flex-1 text-right px-4">
              <h4 className="font-bold text-gray-800 mb-2">Bill to/ Ship to</h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="font-semibold">{customerInfo.name}</p>
                <p>{customerInfo.address}</p>
                <p>{customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}</p>
                <p>State Code: {customerInfo.stateCode}</p>
                <p>
                  Tel: <a href={`tel:${customerInfo.phone}`} className="text-[#00bb07]">{customerInfo.phone}</a>
                </p>
              </div>
            </div>
            
          </div>
        </div>

        <div className="bg-[#fcbd021f] p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                <span className="font-normal text-sm text-gray-600 ml-2">
                  Order ID: {invoiceDetails.orderId}
                </span>
              </h3>
            </div>
            
            {/* Invoice Info */}
            <div className="text-sm text-gray-700">
              <p>Invoice No: {invoiceDetails.invoiceNumber}</p>
              <p className="mt-1">Invoice Generated: {invoiceDetails.invoiceDate}</p>
              <p className="mt-1">CIN: {companyInfo.cin}</p>
              <p>FSSAI License No. {companyInfo.fssaiNo}</p>
            </div>
            
            {/* Sold By */}
            <div className="text-sm">
              <h4 className="font-bold text-gray-800">Sold By:</h4>
              <p className="text-gray-700">{sellerInfo.name}</p>
              <p className="text-gray-600">{sellerInfo.address}</p>
            </div>
            
          </div>
        </div>

        {/* ========== ITEMS TABLE ========== */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-2 text-left font-semibold text-gray-700 border border-gray-200 w-12">#</th>
                <th colSpan={8} className="py-3 px-2 text-left font-semibold text-gray-700 border border-gray-200">Item Name</th>
                {/* <th colSpan={7}></th> */}
                <th className="py-3 px-2 text-center font-semibold text-gray-700 border border-gray-200">QTY</th>
                <th className="py-3 px-2 text-right font-semibold text-gray-700 border border-gray-200">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 border border-gray-200 text-gray-600">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td colSpan={8} className="py-3 px-2 border border-gray-200 font-medium text-gray-800">
                    {item.name}
                  </td>
                {/* <th colSpan={7}></th> */}

                  <td className="py-3 px-2 border border-gray-200 text-center text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2 border border-gray-200 text-right font-semibold text-gray-800">
                    {formatCurrency(calculateItemTotal(item))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="font-semibold">
                <td colSpan="9" className="py-3 px-2 border border-gray-200 text-right text-gray-700">
                  Total:
                </td>
                
                <td className="py-3 px-2 border border-gray-200 text-right text-gray-800">
                  {formatCurrency(totalSGST)}
                </td>
                <td className="py-3 px-2 border border-gray-200 text-right text-gray-900">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ========== SUMMARY SECTION ========== */}
        <div className="p-4">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-700 bg-gray-50 w-80">
                  Membership Cashback
                  <span className="font-normal text-xs text-gray-500 ml-1">(credited within 48hrs)</span>
                </th>
                <td className="py-3 px-4 font-semibold text-gray-800">
                  Rs.{membershipCashback}
                </td>
              </tr>
              <tr className="border border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-700 bg-gray-50">
                  Coupon Discount
                </th>
                <td className="py-3 px-4 font-semibold text-[#00bb07]">
                  - Rs.{formatCurrency(couponDiscount)}
                </td>
              </tr>
              <tr className="border border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-700 bg-gray-50">
                  Delivery Charge
                </th>
                <td className="py-3 px-4 font-semibold text-gray-800">
                  {deliveryCharge === 0 ? (
                    <span className="text-[#00bb07]">FREE</span>
                  ) : (
                    `Rs.${deliveryCharge}`
                  )}
                </td>
              </tr>
              <tr className="border border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-700 bg-gray-50">
                  Saving (MRP - Sale Price)
                </th>
                <td className="py-3 px-4 font-semibold text-[#00bb07]">
                  Rs.{formatCurrency(savings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========== PAYMENT SECTION ========== */}
        <div className="p-4 pt-0">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-700 bg-gray-50 w-80" rowSpan="3">
                  Payment Mode:
                </th>
                <td className="py-2 px-4 text-gray-700 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs.{formatCurrency(subtotal)}</span>
                  </div>
                </td>
              </tr>
              <tr className="border-l border-r border-gray-200">
                <td className="py-2 px-4 text-gray-700 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>COD Amount:</span>
                    <span className="font-semibold">Rs.{formatCurrency(grandTotal)}</span>
                  </div>
                </td>
              </tr>
              <tr className="border-l border-r border-b border-gray-200">
                <td className="py-2 px-4 text-gray-700">
                  <div className="flex justify-between">
                    <span>traditionalcare Cashback:</span>
                    <span className="font-semibold text-[#00bb07]">Rs.{membershipCashback}</span>
                  </div>
                </td>
              </tr>
              
              {/* Grand Total Row */}
              <tr className="bg-[#FCBE00]">
                <th className="py-4 px-4 text-left font-bold text-gray-800 text-lg">
                  Total Order Value
                </th>
                <td className="py-4 px-4 text-right font-bold text-gray-900 text-xl">
                  Rs.{formatCurrency(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        
        {/* ========== TERMS & CONDITIONS ========== */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2 text-sm">Terms & Conditions:</h4>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>1. Goods once sold will not be taken back or exchanged.</li>
            <li>2. All disputes are subject to Gurugram jurisdiction only.</li>
            <li>3. E. & O.E. (Errors and Omissions Excepted)</li>
            <li>4. For any queries, please contact our customer care.</li>
          </ul>
        </div>

        {/* ========== FOOTER ========== */}
        <div className="bg-gray-800 text-white p-4 text-center">
          <p className="font-bold text-lg mb-1">Thank You for Shopping with Traditional Care!</p>
          <p className="text-gray-400 text-sm">A cart Full of Happiness</p>
          <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <p>Toll Free: {companyInfo.tollFree} | Email: support@traditionalcare.com</p>
            <p className="mt-1">www.traditionalcare.com</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantInvoice;