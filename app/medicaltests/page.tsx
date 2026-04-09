'use client'; 
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MedicalTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from our API route
  useEffect(() => {
    fetch('/api/get-tests')
      .then((res) => res.json())
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // 2. Function to Export to Excel (Section D)
  const exportToExcel = () => {
    if (tests.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(tests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MedicalTests");
    XLSX.writeFile(workbook, "MedicalTests.xlsx");
  };

  // 3. Function to Print to PDF (Section D)
  const exportToPDF = () => {
  if (tests.length === 0) return alert("No data to export!");
  
  const doc = new jsPDF();
  doc.text("Medical Tests Report", 14, 15);

  // Use the autoTable function directly
  autoTable(doc, {
    head: [['Test Name', 'Category', 'Unit', 'Min', 'Max']],
    body: tests.map((t: any) => [t.name, t.category, t.unit, t.normalmin, t.normalmax]),
    startY: 20,
    theme: 'grid'
  });

  doc.save("MedicalTests.pdf");
};

  return (
    <div className="p-10 bg-white text-black min-h-screen">
      {/* Header and Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Medical Tests (CRUD)</h1>
        
        <div className="flex gap-4">
          <button 
            onClick={exportToExcel} 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md"
          >
            Export Excel
          </button>
          <button 
            onClick={exportToPDF} 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md"
          >
            Print PDF
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-4 text-left font-bold text-gray-700 border-r border-gray-300">Test Name</th>
              <th className="p-4 text-left font-bold text-gray-700 border-r border-gray-300">Category</th>
              <th className="p-4 text-left font-bold text-gray-700 border-r border-gray-300">Unit</th>
              <th className="p-4 text-center font-bold text-gray-700 border-r border-gray-300">Min</th>
              <th className="p-4 text-center font-bold text-gray-700">Max</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500 italic">
                  Loading data from database...
                </td>
              </tr>
            ) : tests.length > 0 ? (
              tests.map((test: any, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-r border-gray-200">{test.name}</td>
                  <td className="p-4 border-r border-gray-200">{test.category}</td>
                  <td className="p-4 border-r border-gray-200">{test.unit}</td>
                  <td className="p-4 border-r border-gray-200 text-center font-mono">{test.normalmin}</td>
                  <td className="p-4 text-center font-mono">{test.normalmax}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-red-500">
                  No data found. Please check your database connection or seed the data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}