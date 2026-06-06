
export const exportNotePDF = async (note) => {
  const response = await fetch("http://localhost:3000/api/export-note-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note }),
  });
  console.log(response)
  if (!response.ok) {
    throw new Error("PDF export failed");
  }
 const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${note.title || "note"}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
