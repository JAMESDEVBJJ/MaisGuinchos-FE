export type Guincho = {
    id: string;
    nome: string;

    modelo?: string;
    placa?: string;
    cor?: string;
    rating?: number;
    position: { lat: number; lng: number };
  };