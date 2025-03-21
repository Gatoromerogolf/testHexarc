import { jsPDF } from "jspdf";

// Función para generar el PDF
function generarPDF() {
    const doc = new jsPDF();

    // Cargar imagen institucional (debe ser base64 o una URL accesible)
    const img = new Image();
    img.src = "../img/imagenPDF.webp";
    
    img.onload = function () {
        doc.addImage(img, "WEBP", 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        doc.save("documento.pdf");
    };

    // Primera página: Imagen institucional a página completa
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);

    // Agregar nueva página para el índice
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Índice General", 105, 20, { align: "center" });

    // Contenido del índice (ejemplo)
    const indice = [
        "1. Introducción",
        "2. Desarrollo",
        "3. Conclusión"
    ];
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yOffset = 40;
    indice.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 20, yOffset);
        yOffset += 10;
    });

    // Agregar otra página para el contenido
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Contenido generado desde la aplicación", 20, 20);
    
    // Guardar el PDF
    doc.save("documento.pdf");
}

// Llamar a la función para generar el PDF
generarPDF();
