import { Pencil, Upload } from "lucide-react";
import { useState } from "react";

type ProfileInfoProps = {
  user: {
    name: string;
    userName: string;
    email: string;
    numeroTelefone: string;
    cpf: string;
    tipo: string;
  };
};

function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    userName: user.userName,
    email: user.email,
    numeroTelefone: user.numeroTelefone,
    cpf: user.cpf,
    tipo: user.tipo,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      userName: user.userName,
      email: user.email,
      numeroTelefone: user.numeroTelefone,
      cpf: user.cpf,
      tipo: user.tipo,
    });

    setIsEditing(false);
  };

  return (
    <div
      className={`profile-info ${
        user.tipo === "Motorista" ? "has-avatar" : "no-avatar"
      }`}
    >
      {user.tipo === "Motorista" && (
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <span>{user.name?.charAt(0).toUpperCase()}</span>

            <button className="avatar-edit-button">
              <Pencil size={13} />
            </button>
          </div>
        </div>
      )}
      <div className="profile-fields">
        <div className="profile-field">
          <label>Nome</label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>Username</label>

          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>Telefone</label>

          <input
            name="numeroTelefone"
            value={formData.numeroTelefone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>CPF</label>

          <input value={formData.cpf} disabled />

          <small>somente leitura</small>
        </div>

        <div className="profile-field">
          <label>Tipo</label>

          <input value={formData.tipo} disabled />
        </div>
      </div>

      <div className="profile-actions">
        <button
          className="edit-button"
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Cancelar" : "Editar"}
        </button>

        {isEditing && (
          <button className="save-button">Salvar alterações</button>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
