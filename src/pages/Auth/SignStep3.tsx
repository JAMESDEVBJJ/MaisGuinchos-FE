import type { CreateUserRequest } from "../../dtos/CreateUserRequest";

type Props = {
    setForm: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
    onNext: () => void;
};

export default function SignStep3({setForm, onNext }: Props) {

  function selectTipo(tipo: number) {
    setForm((prev) => ({
      ...prev,
      "tipo": tipo,
    }));

    onNext();
  }

  return (
    <div className="tipo-container">
      <h3>Escolha o tipo de conta</h3>

      <div className="tipo-grid">
        <div onClick={() => selectTipo(0)} className="tipo-card">
          Cliente
        </div>

        <div onClick={() => selectTipo(1)} className="tipo-card">
          Motorista
        </div>

        <div onClick={() => selectTipo(2)} className="tipo-card">
          Empresa
        </div>
      </div>
    </div>
  );
}
