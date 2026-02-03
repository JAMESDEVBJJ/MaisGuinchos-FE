import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import SignStep1 from "./SignStep1";
import type { CreateUserRequest } from "../../dtos/CreateUserRequest";
import SignStep2 from "./SignStep2";
import SignStep3 from "./SignStep3";
import { api } from "../../services/api";
import SignStepGuincho from "./SignStepGuincho";

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
    if (step === 1) {
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

      if (form.password != form.confirmPass) {
        alert("Senhas não conferem");
        return;
      }
    } 

    setStep((s) => s + 1);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    console.log(form);

    try {
      let  payload = {};

      if (form.tipo !== 1) {
        payload = {
          name: form.name,
          userName: form.userName,
          cpf: form.cpf,
          numeroTelefone: form.numeroTelefone,
          email: form.email,
          password: form.password,
          tipo: form.tipo,
        };    
      } else {
        payload = {
          name: form.name,
          userName: form.userName,
          cpf: form.cpf,
          numeroTelefone: form.numeroTelefone,
          email: form.email,
          password: form.password,
          tipo: form.tipo,
          guincho: {
            modelo: form.guincho?.modelo,
            cor: form.guincho?.cor,
            placa: form.guincho?.placa,
            cnh: form.guincho?.cnh
          }
        };    
      }
      

      await api.post("/user", payload).then(() => {
        alert("Usuário criado com sucesso :3!");
      });

      navigate("/");
    } catch (error) {
      alert("Erro ao criar a conta. :3");
      console.log(error);
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
    guincho: {
      modelo: "",
      cor: "",
      placa: "",
      cnh: ""
    }
  });

  return (
    <div className="page">
      {step !== 4 && (
        <div className="login-card">
          <h2 className="h2-cadastro">Cadastrar</h2>
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
              onNext={(tipo: number) => {
                if (tipo === 1) {
                  setStep(4);
                } else {
                  console.log("FORM TIPO NAO È 1")
                  handleSubmit();
                }
              }}
            ></SignStep3>
          )}
          {step !== 4 && (
            <Link to="/" className="signup">
              Voltar para login
            </Link>
          )}
        </div>
      )}
      {step === 4 && (
        <SignStepGuincho
          form={form}
          setForm={setForm}
          onBack={prevStep}
          onSubmit={handleSubmit}
        ></SignStepGuincho>
      )}
    </div>
  );
}

export default Signup;
