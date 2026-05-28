import { useState } from "react";
import type { CreateUserRequest } from "../../dtos/CreateUserRequest";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
  onNext: (tipo: number) => void;
};

export default function SignStep3({ setForm, onNext }: Props) {
  //fazer voltar
  function selectTipo(tipo: number) {
    setForm((prev) => ({
      ...prev,
      tipo: tipo,
    }));

    onNext(tipo);
  }

  const [hoverText, setHoverText] = useState(
    ""
  );

  return (
    <div className="tipo-container">
      <h2 className="h2-cadastro bottom">Cadastrar</h2>

      <h3>Escolha o tipo de conta</h3>

      <div className="tipo-grid">
        <div
          onClick={() => selectTipo(0)}
          onMouseEnter={() => setHoverText("Solicite guinchos rapidamente")}
          onMouseLeave={() =>
            setHoverText("")
          }
          className="tipo-card cliente"
        >
          Cliente
        </div>

        <div
          onClick={() => selectTipo(1)}
          onMouseEnter={() => setHoverText("Faça corridas e gerencie pedidos")}
          onMouseLeave={() => setHoverText("")}
          className="tipo-card motorista"
        >
          Motorista
        </div>

        <div
          onClick={() => selectTipo(2)}
          onMouseEnter={() => setHoverText("Gerencie frota e motoristas")}
          onMouseLeave={() => setHoverText("")}
          className="tipo-card empresa"
        >
          Empresa
        </div>
      </div>
      <span key={hoverText} className="tipo-descricao">
        {hoverText}
      </span>
    </div>
  );
}
