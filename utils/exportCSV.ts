interface IPO {
  id: number;
  company: {
    name: string;
    symbol?: string; // ✅ OPTIONAL → FIXES BUILD
  };
  priceBand: string;
  openDate: string;
  closeDate: string;
  issueSize: string;
  issueType: string;
  status: string;
  listingGain?: number;
  currentReturn?: number;
}

export const exportToCSV = (ipos: IPO[]) => {
  const headers = [
    "Company",
    "Symbol",
    "Price Band",
    "Issue Type",
    "Issue Size",
    "Open Date",
    "Close Date",
    "Status",
    "Listing Gain %",
    "Current Return %",
  ];

  const rows = ipos.map((ipo) => [
    ipo.company.name,
    ipo.company.symbol || "N/A", // ✅ SAFE FALLBACK
    ipo.priceBand,
    ipo.issueType,
    ipo.issueSize,
    new Date(ipo.openDate).toLocaleDateString("en-IN"),
    new Date(ipo.closeDate).toLocaleDateString("en-IN"),
    ipo.status,
    ipo.listingGain ?? "N/A",
    ipo.currentReturn ?? "N/A",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bluestock-ipos-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
};
