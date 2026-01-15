import { useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterByIssueType: (type: string) => void;
}

export default function SearchFilter({
  onSearch,
  onFilterByIssueType,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [issueType, setIssueType] = useState("ALL");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleIssueType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIssueType(value);
    onFilterByIssueType(value);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by company name or symbol..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Issue Type Filter */}
      <div>
        <select
          value={issueType}
          onChange={handleIssueType}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none shadow-sm bg-white"
        >
          <option value="ALL">All Issue Types</option>
          <option value="NEW">New Issue</option>
          <option value="RIGHTS">Rights Issue</option>
          <option value="BONUS">Bonus Issue</option>
          <option value="PREFERENTIAL">Preferential</option>
        </select>
      </div>
    </div>
  );
}
