import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ModalShell from '../ui/ModalShell';
import { Button } from '../ui/Button';
import { FileSpreadsheet, FileText, FileJson, FileDown, UploadCloud } from 'lucide-react';

const ExportImportModals = ({ open, type, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [module, setModule] = useState('everything');
  const [format, setFormat] = useState('csv');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);

  const exportData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = [
        { title: 'Sample transaction', category: 'Food', amount: 120 },
      ];

      if (format === 'csv') {
        const csv = ['title,category,amount', ...data.map((item) => `${item.title},${item.category},${item.amount}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `spendwise-export.${format}`;
        link.click();
      } else if (format === 'xlsx') {
        const csv = ['title,category,amount', ...data.map((item) => `${item.title},${item.category},${item.amount}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spendwise-export.csv';
        link.click();
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spendwise-export.json';
        link.click();
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spendwise-export.pdf';
        link.click();
      }

      setLoading(false);
      toast.success(`Exported ${format.toUpperCase()} successfully`);
      onClose();
    }, 600);
  };

  const importData = async () => {
    if (!file) {
      toast.error('Please choose a file to import');
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      const text = await file.text();
      const rows = text.split(/\r?\n/).filter(Boolean).slice(1);
      const previewRows = rows.slice(0, 4).map((row) => row.split(','));
      setPreview(previewRows);
      const invalid = previewRows.filter((row) => row.length < 3);
      if (invalid.length) {
        setErrors(invalid.map((row) => 'Invalid row format'));
        toast.error('Import contains invalid rows');
      } else {
        toast.success('Import preview ready. Confirm to continue.');
      }
    } catch (error) {
      toast.error('Failed to read the selected file');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <ModalShell open={open} title={type === 'export' ? 'Export Data' : 'Import Data'} onClose={onClose}>
      {type === 'export' ? (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="all">All time</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Module</label>
              <select value={module} onChange={(e) => setModule(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="everything">Everything</option>
                <option value="transactions">Transactions</option>
                <option value="budgets">Budgets</option>
                <option value="goals">Goals</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Format</label>
            <div className="grid gap-2 md:grid-cols-4">
              {[
                { value: 'csv', label: 'CSV', icon: FileText },
                { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet },
                { value: 'pdf', label: 'PDF', icon: FileDown },
                { value: 'json', label: 'JSON', icon: FileJson },
              ].map((option) => (
                <button key={option.value} onClick={() => setFormat(option.value)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${format === option.value ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-700'}`}>
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={exportData} isLoading={loading}>
              Export {format.toUpperCase()}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-sm text-slate-600">
            <UploadCloud className="mr-2 h-5 w-5" />
            Choose CSV or Excel file
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          {preview.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Preview</p>
              <div className="mt-3 space-y-2">
                {preview.map((row, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    {row.join(' • ')}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {errors.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.map((error, index) => <div key={index}>{error}</div>)}
            </div>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={importData} isLoading={loading}>Validate & Preview</Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default ExportImportModals;
