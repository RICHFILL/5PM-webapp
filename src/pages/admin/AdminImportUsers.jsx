import React, { useState, useRef } from 'react';
import {API_BASE_URL} from '../../constants';

export default function AdminImportUsers() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError('');
    setResults(null);
    if (selected && !selected.name.toLowerCase().endsWith('.xlsx')) {
      setError('Please select a .xlsx file.');
      setFile(null);
      return;
    }
    setFile(selected || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Choose a file first.');
      return;
    }
    setUploading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem("authToken") || localStorage.getItem("accessToken"); // <-- adjust to your auth storage

      const res = await fetch(`${API_BASE_URL}/admin/investors/import-excel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Import failed');
      }

      setResults(data.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Something went wrong during import.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Import Investors from Excel</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Upload the Investor ROI &amp; Payout Schedule workbook (.xlsx). New investors are created
        automatically with a random investment product assigned. If an email already exists,
        the existing user is left untouched and a new investment is added to their account.
      </p>

      <div
        style={{
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          background: '#fafafa',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{ marginBottom: 12 }}
        />
        {file && (
          <p style={{ fontSize: 13, color: '#374151', marginTop: 8 }}>
            Selected: <strong>{file.name}</strong>
          </p>
        )}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: !file || uploading ? '#9ca3af' : '#111827',
              color: 'white',
              fontWeight: 500,
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Uploading…' : 'Upload & Import'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#fef2f2', color: '#b91c1c', fontSize: 14 }}>
          {error}
        </div>
      )}

      {results && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Import Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            <SummaryCard label="Total rows processed" value={results.totalRows} />
            <SummaryCard label="New users created" value={results.usersCreated} />
            <SummaryCard label="Existing users reused" value={results.usersReused} />
            <SummaryCard label="Investments created" value={results.investmentsCreated} />
            <SummaryCard label="Rows failed" value={results.failed} warn={results.failed > 0} />
            <SummaryCard label="Rows skipped (bad data)" value={results.skippedRows?.length || 0} warn={(results.skippedRows?.length || 0) > 0} />
          </div>

          {results.errors?.length > 0 && (
            <details style={{ marginBottom: 16 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                Warnings / errors ({results.errors.length})
              </summary>
              <ul style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
                {results.errors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}{e.email ? ` (${e.email})` : ''}: {e.error || e.warning}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {results.skippedRows?.length > 0 && (
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                Skipped rows ({results.skippedRows.length})
              </summary>
              <ul style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
                {results.skippedRows.map((s, i) => (
                  <li key={i}>Row {s.row}: {s.reason}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, warn }) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: 14,
        background: warn ? '#fffbeb' : 'white',
      }}
    >
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: warn ? '#b45309' : '#111827' }}>{value}</div>
    </div>
  );
}