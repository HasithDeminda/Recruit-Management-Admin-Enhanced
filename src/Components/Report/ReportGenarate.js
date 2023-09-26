import Excel from "exceljs";
import { saveAs } from "file-saver";
const workbook = new Excel.Workbook();

const workSheetName = "Worksheet-1";
const workBookName = "MyWorkBook";

export const UserRepotGenarate = async (DataArray, Columns, PdfName) => {
  try {
    const fileName = workBookName;

    // creating one worksheet in workbook
    const worksheet = workbook.addWorksheet(workSheetName);
    // add worksheet columns
    // each columns contains header and its mapping key from datawo
    ["A1", "B1", "C1", "D1", "E1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96C8FB" },
        bgColor: { argb: "96C8FB" },
      };
    });

    worksheet.columns = Columns;

    //loop through all of the columns and set the alignment with width.
    worksheet.columns.forEach((column) => {
      column.width = column.header.length + 25;
      column.alignment = { horizontal: "center" };
    });

    // loop through data and add each one to worksheet
    DataArray.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const newRow = worksheet.addRow([
      "© 2022 All rights reserved by Recruiters.com",
    ]);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet

    // merge by start row, start column, end row, end column
    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    worksheet.getCell("A" + currentRowIdx).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };

    // loop through all of the rows and set the outline style.
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      // store each cell to currentCell
      const currentCell = row._cells;

      // loop through currentCell to apply border only for the non-empty cell of excel
      currentCell.forEach((singleCell) => {
        // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
        const cellAddress = singleCell._address;

        // apply border
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // write the content using writeBuffer
    const buf = await workbook.xlsx.writeBuffer();

    // download the processed file
    saveAs(new Blob([buf]), `${PdfName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
    console.error("Something Went Wrong", error.message);
  } finally {
    // removing worksheet's instance to create new one
    workbook.removeWorksheet(workSheetName);
  }
};

export const FeaturedJobsReportGenerate = async (
  DataArray,
  Columns,
  PdfName
) => {
  try {
    const fileName = workBookName;

    // creating one worksheet in workbook
    const worksheet = workbook.addWorksheet(workSheetName);
    // add worksheet columns
    // each columns contains header and its mapping key from datawo
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96C8FB" },
        bgColor: { argb: "96C8FB" },
      };
    });

    worksheet.columns = Columns;

    //loop through all of the columns and set the alignment with width.
    worksheet.columns.forEach((column) => {
      column.width = column.header.length + 20;
      column.alignment = { horizontal: "center" };
    });

    // loop through data and add each one to worksheet
    DataArray.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const newRow = worksheet.addRow([
      "© 2022 All rights reserved by Recruiters.com",
    ]);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet

    // merge by start row, start column, end row, end column
    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    worksheet.getCell("A" + currentRowIdx).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };

    // loop through all of the rows and set the outline style.
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      // store each cell to currentCell
      const currentCell = row._cells;

      // loop through currentCell to apply border only for the non-empty cell of excel
      currentCell.forEach((singleCell) => {
        // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
        const cellAddress = singleCell._address;

        // apply border
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // write the content using writeBuffer
    const buf = await workbook.xlsx.writeBuffer();

    // download the processed file
    saveAs(new Blob([buf]), `${PdfName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
    console.error("Something Went Wrong", error.message);
  } finally {
    // removing worksheet's instance to create new one
    workbook.removeWorksheet(workSheetName);
  }
};

export const AppliedJobReportGenerate = async (DataArray, Columns, PdfName) => {
  try {
    const fileName = workBookName;

    // creating one worksheet in workbook
    const worksheet = workbook.addWorksheet(workSheetName);
    // add worksheet columns
    // each columns contains header and its mapping key from datawo
    ["A1", "B1", "C1", "D1", "E1", "F1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96C8FB" },
        bgColor: { argb: "96C8FB" },
      };
    });

    worksheet.columns = Columns;

    //loop through all of the columns and set the alignment with width.
    worksheet.columns.forEach((column) => {
      column.width = column.header.length + 20;
      column.alignment = { horizontal: "center" };
    });

    // loop through data and add each one to worksheet
    DataArray.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const newRow = worksheet.addRow([
      "© 2022 All rights reserved by Recruiters.com",
    ]);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet

    // merge by start row, start column, end row, end column
    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    worksheet.getCell("A" + currentRowIdx).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };

    // loop through all of the rows and set the outline style.
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      // store each cell to currentCell
      const currentCell = row._cells;

      // loop through currentCell to apply border only for the non-empty cell of excel
      currentCell.forEach((singleCell) => {
        // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
        const cellAddress = singleCell._address;

        // apply border
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // write the content using writeBuffer
    const buf = await workbook.xlsx.writeBuffer();

    // download the processed file
    saveAs(new Blob([buf]), `${PdfName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
    console.error("Something Went Wrong", error.message);
  } finally {
    // removing worksheet's instance to create new one
    workbook.removeWorksheet(workSheetName);
  }
};

export const FeedbackReportGenerate = async (DataArray, Columns, PdfName) => {
  try {
    const fileName = workBookName;

    // creating one worksheet in workbook
    const worksheet = workbook.addWorksheet(workSheetName);
    // add worksheet columns
    // each columns contains header and its mapping key from datawo
    ["A1", "B1", "C1", "D1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96C8FB" },
        bgColor: { argb: "96C8FB" },
      };
    });

    worksheet.columns = Columns;

    //loop through all of the columns and set the alignment with width.
    worksheet.columns.forEach((column) => {
      column.width = column.header.length + 20;
      column.alignment = { horizontal: "center" };
    });

    // loop through data and add each one to worksheet
    DataArray.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const newRow = worksheet.addRow([
      "© 2022 All rights reserved by Recruiters.com",
    ]);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet

    // merge by start row, start column, end row, end column
    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    worksheet.getCell("A" + currentRowIdx).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };

    // loop through all of the rows and set the outline style.
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      // store each cell to currentCell
      const currentCell = row._cells;

      // loop through currentCell to apply border only for the non-empty cell of excel
      currentCell.forEach((singleCell) => {
        // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
        const cellAddress = singleCell._address;

        // apply border
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // write the content using writeBuffer
    const buf = await workbook.xlsx.writeBuffer();

    // download the processed file
    saveAs(new Blob([buf]), `${PdfName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
    console.error("Something Went Wrong", error.message);
  } finally {
    // removing worksheet's instance to create new one
    workbook.removeWorksheet(workSheetName);
  }
};

export const AnnoucementReportGenerate = async (
  DataArray,
  Columns,
  PdfName
) => {
  try {
    const fileName = workBookName;

    // creating one worksheet in workbook
    const worksheet = workbook.addWorksheet(workSheetName);
    // add worksheet columns
    // each columns contains header and its mapping key from datawo
    ["A1", "B1", "C1", "D1", "E1"].map((key) => {
      worksheet.getCell(key).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96C8FB" },
        bgColor: { argb: "96C8FB" },
      };
    });

    worksheet.columns = Columns;

    //loop through all of the columns and set the alignment with width.
    worksheet.columns.forEach((column) => {
      column.width = column.header.length + 20;
      column.alignment = { horizontal: "center" };
    });

    // loop through data and add each one to worksheet
    DataArray.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const newRow = worksheet.addRow([
      "© 2022 All rights reserved by Recruiters.com",
    ]);
    const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
    const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet

    // merge by start row, start column, end row, end column
    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    worksheet.getCell("A" + currentRowIdx).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "96C8FB" },
      bgColor: { argb: "96C8FB" },
    };

    // loop through all of the rows and set the outline style.
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      // store each cell to currentCell
      const currentCell = row._cells;

      // loop through currentCell to apply border only for the non-empty cell of excel
      currentCell.forEach((singleCell) => {
        // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
        const cellAddress = singleCell._address;

        // apply border
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // write the content using writeBuffer
    const buf = await workbook.xlsx.writeBuffer();

    // download the processed file
    saveAs(new Blob([buf]), `${PdfName}.xlsx`);
  } catch (error) {
    console.error("<<<ERRROR>>>", error);
    console.error("Something Went Wrong", error.message);
  } finally {
    // removing worksheet's instance to create new one
    workbook.removeWorksheet(workSheetName);
  }
};
