import { Pencil, Upload } from "lucide-react";
import { useState } from "react";
import type { TowDTO } from "../../../dtos/TowDTO";
import { api } from "../../../services/api";
import { toast } from "react-toastify";
type UserProfile = {
  name: string;
  userName: string;
  email: string;
  numeroTelefone: string;
  cpf: string;
  tipo: string;
  guincho?: TowDTO;
};

type ProfileInfoProps = {
  user: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

function ProfileInfo({ user, setProfile }: ProfileInfoProps) {
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

  async function handleSave() {
    try {
      const updatedUser = await updateUserProfile();

      setIsEditing(false);

      setProfile(updatedUser);

      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Erro inesperado. Tente novamente.";

      toast.error(message);
    }
  }

  async function updateUserProfile() {
    const response = await api.put("/user/profile", {
      name: formData.name,
      userName: formData.userName,
      email: formData.email,
      numeroTelefone: formData.numeroTelefone,
    });

    return response.data;
  }

  return (
    <div
      className={`profile-info ${
        user.tipo === "Motorista" ? "has-avatar" : "no-avatar"
      }`}
    >
      {user.tipo === "Motorista" && user.guincho && (
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {user.guincho.photo ? (
              <img
                src={`https://localhost:7120${user.guincho.photo}`}
                alt="Foto do guincho"
              />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}

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
          <button className="save-button" onClick={handleSave}>
            Salvar alterações
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
