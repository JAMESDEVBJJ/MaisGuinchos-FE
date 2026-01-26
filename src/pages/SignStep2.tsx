import React from "react";
import type { CreateUserRequest } from "../dtos/CreateUserRequest";

type Props = {
    form: CreateUserRequest;
    setForm: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
    onBack: () => void;
    onNext: () => void;
};

export default function SignStep2({ form, setForm, onBack, onNext }: Props) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form className="login-form">
      <h3>Dados pessoais</h3>

      <label className="field">
        <span>Nome:</span>
        <input
          required
          name="name"
          value={form.name}
          onChange={(e) => handleChange(e)}
        />
      </label>

      <label className="field">
        <span>Nome de usuario:</span>
        <input
          value={form.userName}
          required
          name="userName"
          onChange={(e) => handleChange(e)}
        />
      </label>

      <label className="field">
        <span>Telefone:</span>
        <input
          value={form.numeroTelefone}
          required
          name="numeroTelefone"
          onChange={(e) => handleChange(e)}
        />
      </label>

      <label className="field">
        <span>CPF:</span>
        <input
          value={form.cpf}
          required
          name="cpf"
          onChange={(e) => handleChange(e)}
        />
      </label>

      <button type="button" className="login-btn sign-btn" onClick={onNext}>
        AVANÇAR
      </button>

      <button type="button" className="login-btn sign-btn" onClick={onBack}>
        VOLTAR
      </button>
    </form>
  );
}
