import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import SignStep1 from "./SignStep1";
import type { CreateUserRequest } from "../../dtos/CreateUserRequest";
import SignStep2 from "./SignStep2";
import SignStep3 from "./SignStep3";
import { api } from "../../services/api";
import SignStepGuincho from "./SignStepGuincho";
import { toast } from "react-toastify";

function Signup() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

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
        toast.error("Email e senha obrigatórios");
        return;
      } else if (form.email === "") {
        toast.error("Email obrigatório");
        return;
      } else if (form.password === "" || form.confirmPass === "") {
        toast.error("Senha obrigatória");
        return;
      }

      if (form.password != form.confirmPass) {
        toast.error("Senhas não conferem");
        return;
      }
    }

    setStep((s) => s + 1);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    console.log(form);

    try {
      const formData = new FormData();

      formData.append("Name", form.name);
      formData.append("UserName", form.userName);
      formData.append("Cpf", form.cpf);
      formData.append("NumeroTelefone", form.numeroTelefone);
      formData.append("Email", form.email);
      formData.append("Password", form.password);
      formData.append("Tipo", form.tipo.toString());

      if (form.tipo === 1) {
        formData.append("Guincho.Modelo", form.guincho?.modelo ?? "");
        formData.append("Guincho.Cor", form.guincho?.cor ?? "");
        formData.append("Guincho.Placa", form.guincho?.placa ?? "");
        formData.append("Guincho.Cnh", form.guincho?.cnh ?? "");

        if (file) {
          formData.append("Guincho.Foto", file);
        }
      }

      await api.post("/user", formData);

      toast.success("Usuário criado com sucesso!");

      navigate("/");
    } catch (error: any) {
      const data = error.response?.data;

      if (data?.errors) {
        Object.values(data.errors).forEach((messages: any) => {
          messages.forEach((message: string) => {
            toast.error(message);
          });
        });
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.error("Erro ao criar conta.");
      }

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
      cnh: "",
    },
  });

  return (
    <div className="page">
      {step > 1 && (
        <button className="back-button" onClick={prevStep}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
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
                  handleSubmit();
                }
              }}
            ></SignStep3>
          )}
          {step !== 4 && (
            <Link to="/login" className="signup">
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
          setFile={setFile}
        ></SignStepGuincho>
      )}
    </div>
  );
}

export default Signup;
