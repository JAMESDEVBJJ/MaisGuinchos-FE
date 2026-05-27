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

  return (
    <div className="tipo-container">
      <h3>Escolha o tipo de conta</h3>

      <div className="tipo-grid">
        <div onClick={() => selectTipo(0)} className="tipo-card cliente">
          Cliente
        </div>

        <div onClick={() => selectTipo(1)} className="tipo-card motorista">
          Motorista
        </div>

        <div onClick={() => selectTipo(2)} className="tipo-card empresa">
          Empresa
        </div>
      </div>
    </div>
  );
}
