import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < totalPages - 2) pages.push("...");

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination-base">
      <div className="pagination-info">
        Exibindo {startItem}-{endItem} de {totalItems} resultados
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-nav-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        <div className="pagination-pages">
          {visiblePages.map((item, index) =>
            item === "..." ? (
              <span key={`dots-${index}`} className="pagination-dots">
                ...
              </span>
            ) : (
              <button
                key={item}
                className={`pagination-page-btn ${
                  item === page ? "active" : ""
                }`}
                onClick={() => onPageChange(item)}
                disabled={isLoading}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          className="pagination-nav-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || isLoading}
        >
          Próximo
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
