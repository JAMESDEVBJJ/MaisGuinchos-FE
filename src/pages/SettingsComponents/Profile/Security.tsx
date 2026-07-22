import { Check, X } from "lucide-react";
import { useState } from "react";

export default function Security() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    passwordData.newPassword.length > 0 &&
    passwordData.newPassword === passwordData.confirmPassword;

  const passwordsDoNotMatch =
    passwordData.confirmPassword.length > 0 &&
    passwordData.newPassword !== passwordData.confirmPassword;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    // futuramente:
    // chamar API para alterar a senha
  }

  return (
    <div className="security-section">
      <form className="security-form" onSubmit={handleSubmit}>
        <div className="security-fields">
          <div className="profile-field">
            <label htmlFor="currentPassword">Senha atual</label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="newPassword">Nova senha</label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handleChange}
              placeholder="Digite sua nova senha"
            />
          </div>

          <div className="profile-field password-confirm-field">
            <label htmlFor="confirmPassword">Confirmar senha</label>

            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
              />

              {passwordsMatch && (
                <Check className="password-status success" size={18} />
              )}

              {passwordsDoNotMatch && (
                <X className="password-status error" size={18} />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="save-button"
          disabled={!passwordsMatch || !passwordData.currentPassword}
        >
          Alterar senha
        </button>
      </form>
    </div>
  );
}
