import { Pencil } from "lucide-react";
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

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    userName: user.userName,
    email: user.email,
    numeroTelefone: user.numeroTelefone,
    cpf: user.cpf,
    tipo: user.tipo,
  });

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedPhoto(file);

    const previewUrl = URL.createObjectURL(file);

    setPreviewPhoto(previewUrl);
  }

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

    setSelectedPhoto(null);
    setPreviewPhoto(null);

    setIsEditing(false);
  };

  async function handleSave() {
    try {
      const updatedUser = await updateUserProfile();

      setProfile(updatedUser);

      setSelectedPhoto(null);
      setPreviewPhoto(null);

      setIsEditing(false);

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
    const data = new FormData();

    data.append("name", formData.name);
    data.append("userName", formData.userName);
    data.append("email", formData.email);
    data.append("numeroTelefone", formData.numeroTelefone);

    if (selectedPhoto) {
      data.append("photo", selectedPhoto);
    }

    const response = await api.put("/user/profile", data);

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
            {previewPhoto ? (
              <img src={previewPhoto} alt="Preview da foto do guincho" />
            ) : user.guincho.photo ? (
              <img
                src={`https://localhost:7120${user.guincho.photo}`}
                alt="Foto do guincho"
              />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}
            {isEditing && (
              <>
                <button
                  className="avatar-edit-button"
                  onClick={() =>
                    document.getElementById("profile-photo-input")?.click()
                  }
                >
                  <Pencil size={13} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id="profile-photo-input"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </>
            )}
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
