// Universal Excel and PDF Report Exporter
import * as XLSX from 'xlsx';

export function exportToExcel(data, fileName = 'Rapor', sheetName = 'Sayfa1') {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (err) {
    console.error('Excel Export Error:', err);
  }
}

export function exportToPDF(title, headers, rows, fileName = 'Rapor') {
  try {
    const printWindow = window.open('', '_blank');
    const todayStr = new Date().toLocaleDateString('tr-TR');

    let tableHeadersHtml = headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 8px; background: #f1f5f9; text-align: left;">${h}</th>`).join('');
    let tableRowsHtml = rows.map(r => {
      const cells = r.map(c => `<td style="border: 1px solid #cbd5e1; padding: 8px;">${c !== undefined && c !== null ? c : ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #1e293b; }
            h1 { font-size: 18pt; color: #0f172a; margin-bottom: 4px; }
            p { font-size: 10pt; color: #64748b; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 9pt; }
            @media print {
              body { margin: 0; }
              @page { size: A4 landscape; margin: 15mm; }
            }
          </style>
        </head>
        <body>
          <h1>UMUT SİTESİ YÖNETİMİ - ${title.toUpperCase()}</h1>
          <p>Rapor Tarihi: ${todayStr} | Resmi Yönetim Raporu</p>
          <table>
            <thead>
              <tr>${tableHeadersHtml}</tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } catch (err) {
    console.error('PDF Export Error:', err);
  }
}
