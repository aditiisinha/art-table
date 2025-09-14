// src/components/ArtTable.tsx
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTablePageEvent } from "primereact/datatable";
import type { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Artwork } from "./api";
import { fetchArtworksPage } from "./api";
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
      ...selectedArtworks.filter((item) => !pageIds.includes(item.id)), // keep selections from other pages
      ...newSelection, // add selections from this page
    ];

    setSelectedArtworks(merged);
  };

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
          rowsPerPageOptions={[12]} // ✅ only 12 per page allowed
          tableStyle={{ minWidth: "50rem" }}
          metaKeySelection={false}
          className="p-datatable-sm"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column field="title" header="Artwork" sortable style={{ minWidth: "200px" }} />
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
