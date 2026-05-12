"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/api";

interface SelectOption {
  id: string;
  name: string;
  [key: string]: any;
}

interface SelectedItem {
  id?: string;
  name: string;
  isNew?: boolean;
}

interface MultiSelectProps {
  label: string;
  endpoint?: string;
  onSelectionChange: (items: SelectedItem[]) => void;
  allowCreate?: boolean;
  placeholder?: string;
  selectedIds?: string[];
}

export default function MultiSelect({
  label,
  endpoint,
  onSelectionChange,
  allowCreate = true,
  placeholder = "Search or add items...",
  selectedIds = [],
}: MultiSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!endpoint) return;
      try {
        const data = await getAdmin(endpoint);
        setOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching options:", err);
        setOptions([]);
      }
    };

    fetchOptions();
  }, [endpoint]);

  useEffect(() => {
    if (selectedIds.length > 0 && options.length > 0) {
      const items = selectedIds
        .map((id) => options.find((opt) => opt.id === id))
        .filter(Boolean) as SelectOption[];

      setSelectedItems(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          isNew: false,
        }))
      );
    }
  }, [selectedIds, options]);

  const filtered = options
    .filter((opt) => !selectedItems.some((sel) => sel.id === opt.id))
    .filter((opt) => opt.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleSelect = (option: SelectOption) => {
    const newItems = [
      ...selectedItems,
      { id: option.id, name: option.name, isNew: false },
    ];
    setSelectedItems(newItems);
    onSelectionChange(newItems);
    setSearchTerm("");
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && allowCreate) {
      const newItems = [
        ...selectedItems,
        { name: searchTerm, isNew: true },
      ];
      setSelectedItems(newItems);
      onSelectionChange(newItems);
      setSearchTerm("");
    }
  };

  const removeItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
    onSelectionChange(newItems);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              <span>{item.name}</span>
              {item.isNew && <span className="text-xs font-bold">(new)</span>}
              <button
                onClick={() => removeItem(idx)}
                className="font-bold hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="border p-2 bg-white cursor-pointer flex justify-between items-center"
        >
          <span className="text-gray-500 text-sm">{placeholder}</span>
          <span className="text-gray-500">▼</span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 border border-t-0 bg-white z-10 max-h-64 overflow-y-auto">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border p-2 text-sm"
                autoFocus
              />
            </div>

            {endpoint && filtered.length === 0 && !searchTerm && (
              <div className="p-3 text-gray-500 text-sm">No options available</div>
            )}

            {endpoint &&
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleSelect(opt)}
                  className="w-full text-left p-3 hover:bg-gray-100 border-b text-sm"
                >
                  ☐ {opt.name}
                </button>
              ))}

            {searchTerm && allowCreate && (
              <button
                onClick={handleCreateNew}
                className="w-full text-left p-3 bg-green-50 text-green-700 border-b text-sm font-medium hover:bg-green-100"
              >
                ➕ Add new: {searchTerm}
              </button>
            )}

            {selectedItems.length > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-gray-100 border-b text-sm"
              >
                ✓ Done selecting
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
