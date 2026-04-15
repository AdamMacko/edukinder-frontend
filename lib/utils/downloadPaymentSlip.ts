"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadPaymentSlipFromElement(
    elementId: string,
    fileName: string
) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, {
        scale: 2, // Zabezpečí ostrosť QR kódu v PDF
        useCORS: true,
        backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
    pdf.save(fileName);
}