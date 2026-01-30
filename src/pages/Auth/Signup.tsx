import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import SignStep1 from "./SignStep1";
import type { CreateUserRequest } from "../../dtos/CreateUserRequest";
import SignStep2 from "./SignStep2";
import SignStep3 from "./SignStep3";
import { api } from "../../services/api";

function Signup() {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  function nextStep() {
    handleNext();
  }

  function prevStep() {
    setStep((s) => s - 1);
  }

  function handleNext() {
    if (
      form.email === "" &&
      (form.password === "" || form.confirmPass === "")
    ) {
      alert("Email e senha obrigatórios");
      return;
    } else if (form.email === "") {
      alert("Email obrigatório");
      return;
    } else if (form.password === "" || form.confirmPass === "") {
      alert("Senha obrigatória");
      return;
    }

    setStep((s) => s + 1);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    console.log(form);

    try {
      const payload = {
        name: form.name,
        userName: form.userName,
        cpf: form.cpf,
        numeroTelefone: form.numeroTelefone,
        email: form.email,
        password: form.password,
        tipo: form.tipo,
      };

      await api.post("/user", payload);

      alert("Usuário criado com sucesso :3!");

      navigate("/");
    } catch (error) {

      alert("Erro ao criar a conta. :3")
      console.log(error)

    }
  }

  const [form, setForm] = useState<CreateUserRequest>({
    name: "",
    userName: "",
    cpf: "",
    numeroTelefone: "",
    email: "",
    password: "",
    confirmPass: "",
    tipo: 0,
  });

  return (
    <div className="page">
      <div className="login-card">
        <h2>Cadastrar</h2>
        {step === 1 && (
          <SignStep1
            form={form}
            setForm={setForm}
            onNext={nextStep}
          ></SignStep1>
        )}
        {step === 2 && (
          <SignStep2
            form={form}
            setForm={setForm}
            onBack={prevStep}
            onNext={nextStep}
          ></SignStep2>
        )}
        {step === 3 && (
          <SignStep3
            setForm={setForm}
            onNext={() => {
              if (form.tipo === 1) {
                setStep(4);
              } else {
                handleSubmit();
              }
            }}
          ></SignStep3>
        )}

        <Link to="/" className="signup">
          Voltar para login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
