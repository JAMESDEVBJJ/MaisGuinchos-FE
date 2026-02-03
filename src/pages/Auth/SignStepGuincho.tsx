import type { CreateUserRequest } from "../../dtos/CreateUserRequest";
import styles from "../../styles/SignupGuincho.module.css";

type Props = {
  form: CreateUserRequest;
  setForm: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
  onBack: () => void;
  onSubmit: () => void;
};

export default function SignStepGuincho({
  form,
  setForm,
  onBack, //fazer
  onSubmit,
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setForm(prev => ({
      ...prev,
      guincho: {
        ...prev.guincho!,
        [name]: value
      }
    }));
  }

  return (
    <div className={styles.page}>
      <h2 className={`${styles.h2Cadastro}`}>Cadastrar guincho</h2>

      <div className={`${styles.guinchoLayout}`}>
        <form className={`${styles.loginForm}`}>
          <label className={`${styles.field}`}>
            <span>Modelo</span>
            <input
              required
              name="modelo"
              value={form.guincho?.modelo}
              onChange={(e) => handleChange(e)}
            />
          </label>

          <label className={`${styles.field}`}>
            <span>Cor</span>
            <input
              required
              name="cor"
              value={form.guincho?.cor}
              onChange={(e) => handleChange(e)}
            />
          </label>

          <label className={`${styles.field}`}>
            <span>Placa</span>
            <input
              required
              name="placa"
              value={form.guincho?.placa}
              onChange={(e) => handleChange(e)}
            />
          </label>

          <label className={`${styles.field}`}>
            <span>CNH</span>
            <input
              required
              name="cnh"
              value={form.guincho?.cnh}
              onChange={(e) => handleChange(e)}
            />
          </label>
        </form>

        <div className={styles.guinchoSide}>
          <div className={`${styles.photoBox}`}>
            <span>Adicionar foto</span>
          </div>

          <button className={`${styles.loginBtn}`} onClick={onSubmit}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
