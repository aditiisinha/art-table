// src/components/ArtTable.tsx
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTablePageEvent } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Artwork } from "./api";
import { fetchArtworksPage } from "./api";

// ✅ Needed imports
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ArtTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(12); // ✅ max 12 per page

  // ✅ Overlay states
  const op = useRef<OverlayPanel>(null);
  const [rowsToSelect, setRowsToSelect] = useState<number>(0);

  // Fetch artworks
  const loadData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const result = await fetchArtworksPage(page, limit);
      setArtworks(result.items);
      setTotalRecords(result.total);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = Math.floor(first / rows) + 1;
    loadData(page, rows);
  }, [first, rows]);

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // ✅ Persist selection across pages
  const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    const newSelection = e.value || [];
    const pageIds = artworks.map((a) => a.id);

    // merge current page selection with previously stored selections
    const merged = [
      ...selectedArtworks.filter((item) => !pageIds.includes(item.id)),
      ...newSelection,
    ];

    setSelectedArtworks(merged);
  };

  // ✅ Handle overlay submit
  const handleOverlaySubmit = () => {
    if (rowsToSelect > 0) {
      const autoSelect = artworks.slice(0, rowsToSelect);
      const pageIds = artworks.map((a) => a.id);

      const merged = [
        ...selectedArtworks.filter((item) => !pageIds.includes(item.id)),
        ...autoSelect,
      ];
      setSelectedArtworks(merged);
    }
    op.current?.hide();
  };

  // ✅ Custom header for Artwork with chevron on LEFT
  const artworkHeader = (
    <div className="flex items-center gap-2">
      <i
        className="pi pi-chevron-down cursor-pointer"
        onClick={(e) => op.current?.toggle(e)}
      />
      <span>Artwork</span>
      <OverlayPanel ref={op} dismissable>
        <div className="p-3 w-60">
          <label className="block mb-2 text-sm font-medium">Select rows</label>
          <InputNumber
            value={rowsToSelect}
            onValueChange={(e) => setRowsToSelect(e.value ?? 0)}
            className="w-full mb-3"
            // ✅ removed showButtons to hide increment/decrement buttons
          />
          <Button
            label="Submit"
            className="w-full"
            style={{
              backgroundColor: '#e5e7eb', // light gray (Tailwind gray-200 equivalent)
              borderColor: '#d1d5db',     // slightly darker border
              color: 'black'    
            }}
            onClick={handleOverlaySubmit}
          />
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Artworks</h1>
      <div className="card">
        <DataTable
          value={artworks}
          selection={selectedArtworks}
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
          dataKey="id"
          paginator
          lazy
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          loading={loading}
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          rowsPerPageOptions={[12]}
          tableStyle={{ minWidth: "50rem" }}
          metaKeySelection={false}
          className="p-datatable-sm"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          {/* ✅ updated header here */}
          <Column
            field="title"
            header={artworkHeader}
            sortable
            style={{ minWidth: "200px" }}
          />
          <Column field="place_of_origin" header="Place of Origin" sortable style={{ minWidth: "150px" }} />
          <Column field="artist_display" header="Artist" sortable style={{ minWidth: "150px" }} />
          <Column field="inscriptions" header="Inscriptions" sortable style={{ minWidth: "150px" }} />
          <Column field="date_start" header="Start Year" sortable style={{ minWidth: "100px" }} />
          <Column field="date_end" header="End Year" sortable style={{ minWidth: "100px" }} />
        </DataTable>
      </div>

      {/* ✅ Custom selection panel */}
      {selectedArtworks.length > 0 && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-blue-800 font-medium mb-2">
            {selectedArtworks.length} item{selectedArtworks.length !== 1 ? "s" : ""} selected:
          </p>
          <ul className="list-disc list-inside text-blue-700">
            {selectedArtworks.map((art) => (
              <li key={art.id}>{art.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtTable;
