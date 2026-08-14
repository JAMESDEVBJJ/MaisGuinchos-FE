import { useEffect, useRef, useState, type JSX } from "react";
import "../../styles/Filtro.css";

export type FiltroId =
    | "distancia"
    | "avaliacao"
    | "preço";

interface FiltroOption {
    id: FiltroId;
    label: string;
    icon: JSX.Element;
}

const ICON_PROPS = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

const FILTROS: FiltroOption[] = [
    {
        id: "distancia",
        label: "Distância",
        icon: (
            <svg {...ICON_PROPS}>
                <circle cx="5" cy="6.5" r="2" />
                <circle cx="19" cy="17.5" r="2" />
                <path d="M6.8 7.8L17.2 16.2" strokeDasharray="2.5 3" />
            </svg>
        ),
    },
    {
        id: "avaliacao",
        label: "Avaliação",
        icon: (
            <svg {...ICON_PROPS}>
                <polygon points="12 3 14.7 9.2 21.5 9.9 16.4 14.4 17.9 21 12 17.4 6.1 21 7.6 14.4 2.5 9.9 9.3 9.2 12 3" />
            </svg>
        ),
    },
    {
        id: "preço",
        label: "Preço",
        icon: (
            <svg {...ICON_PROPS}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6.5v11" />
                <path d="M15 9c0-1.4-1.4-2.4-3.2-2.4S8.6 7.6 8.6 8.9c0 3 6.4 1.4 6.4 4.5 0 1.4-1.4 2.5-3.2 2.5S8.6 15 8.6 13.6" />
            </svg>
        ),
    },
];

interface FiltrosRapidosProps {
    activeFilters?: FiltroId[];
    onFiltersChange?: (filters: FiltroId[]) => void;
    defaultOpen?: boolean;
}

export default function FiltrosRapidos({
    activeFilters: controlledFilters,
    onFiltersChange,
    defaultOpen = false,
}: FiltrosRapidosProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [internalFilters, setInternalFilters] = useState<FiltroId[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState(0);

    const activeFilters = controlledFilters ?? internalFilters;

    const toggleFilter = (id: FiltroId) => {
        const next = activeFilters.includes(id)
            ? activeFilters.filter((f) => f !== id)
            : [...activeFilters, id];

        if (onFiltersChange) {
            onFiltersChange(next);
        } else {
            setInternalFilters(next);
        }
    };


    useEffect(() => {
        if (!contentRef.current) return;
        setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }, [isOpen, activeFilters.length]);

    useEffect(() => {
        if (!isOpen) return;
        const onResize = () => {
            if (contentRef.current) setMaxHeight(contentRef.current.scrollHeight);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [isOpen]);

    return (
        <div className="filtros-rapidos">
            <button
                type="button"
                className={`filtros-toggle ${isOpen ? "is-open" : ""}`}
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
            >
                <span className="filtros-toggle-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    Filtros
                    {activeFilters.length > 0 && (
                        <span className="filtros-badge">{activeFilters.length}</span>
                    )}
                </span>
                <svg
                    className="filtros-chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div className={`filtros-panel ${isOpen ? "is-open" : ""}`} style={{ maxHeight }}>
                <div ref={contentRef} className="filtros-panel-inner">
                    <div className="filtros-chips">
                        {FILTROS.map((filtro) => {
                            const active = activeFilters.includes(filtro.id);
                            return (
                                <button
                                    key={filtro.id}
                                    type="button"
                                    className={`filtro-chip ${active ? "is-active" : ""}`}
                                    onClick={() => toggleFilter(filtro.id)}
                                >
                                    {filtro.icon}
                                    {filtro.label}
                                    {active && (
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="filtro-chip-close"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
