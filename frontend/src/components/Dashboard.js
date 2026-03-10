import React, { useState } from "react";
import AdminEntry from "./AdminEntry";
import { deleteEntry } from "../api";

const Dashboard = ({ data = [], isAdmin = true, aliases = {}, refreshData = () => {} }) => {

  const [activeTab, setActiveTab] = useState("egg");

  const stats = {
    egg: { eaten: 0, paid: 0, cost: 0, members: {}, history: [], payments: [] },
    bike: { total: 0, members: { v: 0, D: 0, h: 0 }, history: [] },
    personal: { total: 0, history: [] }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent Delete?")) {
      await deleteEntry(id);
      refreshData();
    }
  };

  data.forEach((item) => {
    const pk = item.payer || item.n;

    if (item.type === "egg_log") {
      const p = item.pricePerEgg || 6;

      stats.egg.history.push(item);

      (item.consumptionData || item.t || "")
        .split(";")
        .forEach((e) => {
          const match = e.trim().match(/(\d+)\s*([a-zA-Z]+)/);
          if (match) {
            const [, count, key] = match;
            const n = parseInt(count);

            if (!stats.egg.members[key])
              stats.egg.members[key] = { e: 0, c: 0, p: 0 };

            stats.egg.members[key].e += n;
            stats.egg.members[key].c += n * p;

            stats.egg.eaten += n;
            stats.egg.cost += n * p;
          }
        });

    } else if (item.type === "egg_pay") {

      stats.egg.payments.push(item);

      if (!stats.egg.members[pk])
        stats.egg.members[pk] = { e: 0, c: 0, p: 0 };

      stats.egg.members[pk].p += item.amount;
      stats.egg.paid += item.amount;

    } else if (item.type === "bike_pay") {

      stats.bike.total += item.amount;
      stats.bike.history.push(item);

      if (stats.bike.members.hasOwnProperty(pk))
        stats.bike.members[pk] += item.amount;

    } else if (item.type === "expense") {

      stats.personal.total += item.amount;
      stats.personal.history.push(item);
    }
  });

  const stock = (stats.egg.paid - stats.egg.cost) / 6;

  return (
    <div className="container">

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "egg" ? "active" : ""}`}
          onClick={() => setActiveTab("egg")}
        >
          🥚 Eggs
        </button>

        <button
          className={`tab-btn ${activeTab === "bike" ? "active" : ""}`}
          onClick={() => setActiveTab("bike")}
        >
          🏍️ Bike
        </button>

        {isAdmin && (
          <button
            className={`tab-btn ${activeTab === "expense" ? "active" : ""}`}
            onClick={() => setActiveTab("expense")}
          >
            💸 Expenses
          </button>
        )}
      </div>

      {/* EGG TAB */}
      {activeTab === "egg" && (
        <div className="section active">

          <div className="stat-row">
            <div className="stat-box">
              <small>STOCK (EGGS)</small>
              <h2>{stock.toFixed(1)}</h2>
            </div>

            <div className="stat-box">
              <small>TOTAL EATEN</small>
              <h2>{stats.egg.eaten}</h2>
            </div>

            <div className="stat-box">
              <small>SPENT</small>
              <h2 style={{ color: "red" }}>₹{stats.egg.cost.toFixed(0)}</h2>
            </div>
          </div>

          {isAdmin && (
            <AdminEntry type="egg" refreshData={refreshData} aliases={aliases} />
          )}

        </div>
      )}

      {/* BIKE TAB */}
      {activeTab === "bike" && (
        <div className="section active">

          <div className="stat-row">
            <div className="stat-box">
              <small>TOTAL PETROL</small>
              <h2>₹{stats.bike.total}</h2>
            </div>
          </div>

          {isAdmin && (
            <AdminEntry type="bike" refreshData={refreshData} aliases={aliases} />
          )}

        </div>
      )}

      {/* EXPENSE TAB */}
      {activeTab === "expense" && isAdmin && (
        <div className="section active">

          <div className="stat-row">
            <div className="stat-box">
              <small>PERSONAL GRAND TOTAL</small>
              <h2>₹{stats.personal.total.toFixed(2)}</h2>
            </div>
          </div>

          <AdminEntry
            type="expense"
            refreshData={refreshData}
            aliases={aliases}
          />

        </div>
      )}

    </div>
  );
};

export default Dashboard;