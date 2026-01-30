import type { CreateUserRequest } from "../../dtos/CreateUserRequest";

type Props = {
    form: CreateUserRequest;
    setForm: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
    onNext: () => void;
};

export default function SignStep1({form, setForm, onNext} : Props) {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        const value = e.target.value;
    
        setForm((prev) => ({
          ...prev, 
          [name]: value
        }));
      }

    return (
    <form className="login-form">
    
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" required value={form.email} onChange={(e) => handleChange(e)}/> 
          </label>
    
          <label className="field">
            <span>Senha</span>
            <input type="password" name="password" value={form.password} required onChange={(e) => handleChange(e)}/>
          </label>
    
          <label className="field">
            <span>Confirmar senha</span>
            <input type="password" required name="confirmPass" value={form.confirmPass} onChange={(e) => handleChange(e)}/>
          </label>
    
          <button type="button" className="login-btn sign-btn" onClick={onNext}>
            AVANÇAR
          </button>
        </form>);
    }