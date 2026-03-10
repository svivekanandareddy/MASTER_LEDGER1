import React, { useEffect, useState } from "react";
import { fetchData, addEntry, deleteEntry } from "../api";

function Dashboard() {

  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "credit"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await fetchData();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addEntry(formData);

      setFormData({
        name: "",
        amount: "",
        type: "credit"
      });

      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vivek & Co.</h1>

      <h3>Add Entry</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
        />

        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <button type="submit">Add</button>
      </form>

      <h3>Ledger Entries</h3>

      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            {entry.name} — ₹{entry.amount} ({entry.type})
            <button onClick={() => handleDelete(entry._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;