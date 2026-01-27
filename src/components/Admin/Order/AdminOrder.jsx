import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../css/AdminOrder.css";

const dummyOrders = [
  {
    id: "ORD101",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    address: "Delhi, India",
    amount: 1499,
    discount: null,
    couponApplied: false,
    couponCode: null,
    payment: "Razorpay",
    date: "2026-01-10",
    status: "Processing",
    courier: "Shiprocket",
    awb: "SR123456",
    tracking: "https://track.shiprocket.com/SR123456",
    items: [
      {
        image: "https://via.placeholder.com/80",
        name: "Traditional Herbal Hair Oil",
        sku: "HAIR-001",
        qty: 1,
        price: 1499,
        total: 1499
      }
    ]
  },

  {
    id: "ORD102",
    name: "Amit Kumar",
    phone: "9123456789",
    email: "amit@example.com",
    address: "Mumbai, India",
    amount: 1999,
    discount: "₹200 (10%)",
    couponApplied: true,
    couponCode: "CARE10",
    payment: "COD",
    date: "2026-01-12",
    status: "Shipped",
    courier: "Delhivery",
    awb: "DLH987654",
    tracking: "https://track.delhivery.com/DLH987654",
    items: [
      {
        image: "https://via.placeholder.com/80",
        name: "Ayurvedic Skin Cream",
        sku: "SKIN-002",
        qty: 1,
        price: 1999,
        total: 1999
      }
    ]
  },

  {
    id: "ORD103",
    name: "Neha Patel",
    phone: "9876512345",
    email: "neha@example.com",
    address: "Ahmedabad, India",
    amount: 2499,
    discount: "₹150 (6%)",
    couponApplied: false,
    couponCode: null,
    payment: "Razorpay",
    date: "2026-01-14",
    status: "Packed",
    courier: "Bluedart",
    awb: "BD123789",
    tracking: "https://track.bluedart.com/BD123789",
    items: [
      {
        image: "https://via.placeholder.com/80",
        name: "Traditional Neem Face Wash",
        sku: "FACE-003",
        qty: 1,
        price: 2499,
        total: 2499
      }
    ]
  }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("Pending");

  const [showFromCal, setShowFromCal] = useState(false);
  const [showToCal, setShowToCal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const toggleSelectAll = (checked) => {
    setSelectedOrders(checked ? orders.map(o => o.id) : []);
  };

  const toggleSingleSelect = (orderId, checked) => {
    setSelectedOrders(prev =>
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  const changeSingleStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  const applyBulkStatus = () => {
    setOrders(prev =>
      prev.map(o =>
        selectedOrders.includes(o.id)
          ? { ...o, status: bulkStatus }
          : o
      )
    );
    alert("Bulk status updated successfully!");
  };

  const downloadSingleInvoice = (order) => {
    alert(`Downloading invoice for ${order.id}`);
  };

  const downloadBulkInvoices = () => {
    alert(`Downloading invoices for ${selectedOrders.length} orders`);
  };

  return (
    <div className="orders-container">

      <h1 className="orders-title">Admin Orders</h1>

      {/* BULK BAR */}
      <div className="bulk-bar">
        <input
          type="checkbox"
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
        <span>Select All</span>

        <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
          <option>Pending</option>
          <option>Processing</option>
          <option>Packed</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <button className="bulk-btn" onClick={applyBulkStatus}>
          Change Status in Bulk
        </button>

        <button className="invoice-btn" onClick={downloadBulkInvoices}>
          Download Invoices
        </button>
      </div>

      {/* FILTERS (SAME LOOK + BACKSPACE ENABLED) */}
      <div className="filters-box">

        {/* FROM DATE */}
        <div className="date-wrapper">
          <input
            type="text"
            placeholder="DD-MM-YYYY"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            onClick={() => setShowFromCal(!showFromCal)}
          />
          <span className="calendar-icon" onClick={() => setShowFromCal(!showFromCal)}>
            📅
          </span>

          {showFromCal && (
            <div className="calendar-popup">
              <Calendar
                onChange={(date) => {
                  setFromDate(date.toLocaleDateString("en-GB"));
                  setShowFromCal(false);
                }}
              />
            </div>
          )}
        </div>

        {/* TO DATE */}
        <div className="date-wrapper">
          <input
            type="text"
            placeholder="DD-MM-YYYY"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            onClick={() => setShowToCal(!showToCal)}
          />
          <span className="calendar-icon" onClick={() => setShowToCal(!showToCal)}>
            📅
          </span>

          {showToCal && (
            <div className="calendar-popup">
              <Calendar
                onChange={(date) => {
                  setToDate(date.toLocaleDateString("en-GB"));
                  setShowToCal(false);
                }}
              />
            </div>
          )}
        </div>

        <select className="filter-select">
          <option>All</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
        </select>

        <input className="search-input" placeholder="Search order..." />

      </div>

      {/* ORDERS TABLE */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th></th>
              <th>Sr No</th>
              <th>Product</th>
              <th>Order ID</th>
              <th>SKU</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Coupon</th>
              <th>Code</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, index) => (
              <tr key={o.id}>

                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(o.id)}
                    onChange={(e) =>
                      toggleSingleSelect(o.id, e.target.checked)
                    }
                  />
                </td>

                <td>{index + 1}</td>

                <td>
                  <img src={o.items[0].image} className="order-thumb" />
                </td>

                <td>{o.id}</td>
                <td>{o.items[0].sku}</td>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>₹{o.amount}</td>

                <td>{o.discount || "-"}</td>
                <td>{o.couponApplied ? "Yes" : "No"}</td>
                <td>{o.couponCode || "-"}</td>

                <td>{o.payment}</td>
                <td>{o.date}</td>

                <td>
                  <span className={`status ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </td>

                <td className="actions">
                  <button className="view-btn" onClick={() => setSelectedOrder(o)}>
                    View
                  </button>

                  <button
                    className="invoice-btn"
                    onClick={() => downloadSingleInvoice(o)}
                  >
                    Invoice
                  </button>

                  <select
                    className="status-select"
                    value={o.status}
                    onChange={(e) => changeSingleStatus(o.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Order Details - {selectedOrder.id}</h2>

            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Amount:</b> ₹{selectedOrder.amount}</p>
            <p><b>Coupon:</b> {selectedOrder.couponApplied ? "Yes" : "No"}</p>

            {selectedOrder.discount && (
              <p><b>Discount:</b> {selectedOrder.discount}</p>
            )}

            <button className="invoice-btn">
              Download Invoice
            </button>

            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
