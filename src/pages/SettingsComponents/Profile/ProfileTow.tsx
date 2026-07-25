import { useEffect, useState } from "react";
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

type ProfileTowProps = {
  guincho: TowDTO;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

function ProfileTow({ guincho, setProfile }: ProfileTowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    model: guincho.model,
    plate: guincho.plate,
    color: guincho.color,
  });

  useEffect(() => {
    setFormData({
      model: guincho.model,
      plate: guincho.plate,
      color: guincho.color,
    });
  }, [guincho]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCancel() {
    setFormData({
      model: guincho.model,
      plate: guincho.plate,
      color: guincho.color,
    });

    setIsEditing(false);
  }

  async function handleSave() {
    try {
      const updatedUser: UserProfile = await updateUserProfile();

      console.log("PUT retornou:", updatedUser);

      setProfile(updatedUser);

      console.log("setProfile executado");

      setIsEditing(false);

      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.log("ERRO REAL:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Erro inesperado. Tente novamente.";

      toast.error(message);
    }
  }
  async function updateUserProfile() {
    const data = new FormData();

    data.append("guincho.model", formData.model);
    data.append("guincho.plate", formData.plate);
    data.append("guincho.color", formData.color);

    const response = await api.put("/user/profile", data);

    return response.data;
  }

  return (
    <div className="profile-tow">
      <div className="profile-fields">
        <div className="profile-field">
          <label>Modelo</label>

          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>Placa</label>

          <input
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-field">
          <label>Cor</label>

          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            disabled={!isEditing}
          />
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

export default ProfileTow;
