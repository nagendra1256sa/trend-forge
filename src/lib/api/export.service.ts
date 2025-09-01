import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_TYPE = 'text/csv;charset=utf-8;';
const CSV_EXTENSION = '.csv';

export interface ExportInput {
  filters?: any;
  data: any[];
}

export function exportAsFile(
  input: ExportInput,
  fileType: 'excel' | 'csv',
  fileName: string
): void {
  const json: any[] = [];
  for (const element of input.data) {
    json.push(element);
  }

  if (fileName === 'ExportOrders') {
    const worksheet: XLSX.WorkSheet = XLSX?.utils?.json_to_sheet(json);
    let buffer: any;
    let type: string = EXCEL_TYPE;
    let extension: string;

    if (fileType === 'excel') {
      extension = EXCEL_EXTENSION;
      const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    } else {
      type = CSV_TYPE;
      extension = CSV_EXTENSION;
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      buffer = '\uFEFF' + csvData;
    }

    saveAsFile(buffer, type, extension, fileName);
  }
}

function saveAsFile(
  buffer: any,
  type: string,
  extension: string,
  fileName: string
): void {
  const data: Blob = new Blob([buffer], { type });
  const url = URL.createObjectURL(data);
  const dwldLink = document?.createElement('a');

  const isSafariBrowser =
    navigator?.userAgent?.includes('Safari') &&
    !navigator?.userAgent?.includes('Chrome');

  if (isSafariBrowser) {
    dwldLink?.setAttribute('target', '_blank');
  }

  dwldLink?.setAttribute('href', url);
  dwldLink?.setAttribute('download', fileName + extension);
  dwldLink.style.visibility = 'hidden';

  document?.body?.append(dwldLink);
  dwldLink.click();
  dwldLink.remove();
}
