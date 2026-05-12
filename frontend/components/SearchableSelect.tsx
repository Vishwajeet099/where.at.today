"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";

interface SelectOption {
  id: string;
  name: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  label: string;
  endpoint: string;
  onSelect: (option: SelectOption | null) => void;
  onCreateNew?: (name: string) => void;
  selectedId?: string;
  allowCreate?: boolean;
  placeholder?: string;
  filterText?: (item: SelectOption) => string;
}

export default function SearchableSelect({
  label,
  endpoint,
  onSelect,
  onCreateNew,
  selectedId,
  allowCreate = true,
  placeholder = "Search...",
  filterText = (item) => item.name,
}: SearchableSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<SelectOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await getAdmin(endpoint);
        setOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, [endpoint]);

  useEffect(() => {
    if (selectedId) {
      const found = options.find((opt) => opt.id === selectedId);
      if (found) {
        setSelected(found);
      }
    }
  }, [selectedId, options]);

  const filtered = options.filter((opt) =>
    filterText(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
    setSearchTerm("");
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    if (newItemName.trim() && onCreateNew) {
      onCreateNew(newItemName);
      setNewItemName("");
      setIsCreating(false);
      setSearchTerm("");
    }
  };

  const handleClear = () => {
    setSelected(null);
    onSelect(null);
    setSearchTerm("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border p-2 text-left bg-white flex justify-between items-center"
        >
          <span className="text-black">{selected?.name || placeholder}</span>
          <span className="text-black">▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 border border-t-0 bg-white z-10 max-h-64 overflow-y-auto">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 text-sm text-black"
                autoFocus
              />
            </div>

            {!isCreating && (
              <>
                {filtered.length === 0 && !searchTerm && (
                  <div className="p-3 text-black text-sm">No options</div>
                )}

                {filtered.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left text-black p-3 hover:bg-gray-100 border-b text-sm"
                  >
                    {filterText(opt)}
                  </button>
                ))}

                {searchTerm && filtered.length === 0 && allowCreate && (
                  <button
                    onClick={() => {
                      setIsCreating(true);
                      setNewItemName(searchTerm);
                    }}
                    className="w-full text-left text-black p-3 bg-blue-50 text-blue-700 border-b text-sm font-medium hover:bg-blue-100"
                  >
                    ➕ Create new: {searchTerm}
                  </button>
                )}

                {selected && (
                  <button
                    onClick={handleClear}
                    className="w-full text-left text-black p-3 hover:bg-red-50 text-red-700 border-b text-sm"
                  >
                    ✕ Clear selection
                  </button>
                )}
              </>
            )}

            {isCreating && (
              <div className="p-3 border-b">
                <div className="mb-2">
                  <label className="text-sm block mb-1">Item name:</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full border p-2 text-sm"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateNew}
                    className="flex-1 bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewItemName("");
                    }}
                    className="flex-1 bg-gray-400 text-white p-2 rounded text-sm hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
