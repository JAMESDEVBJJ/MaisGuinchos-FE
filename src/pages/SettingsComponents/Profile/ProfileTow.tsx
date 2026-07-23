import { useEffect, useState } from "react";
import type { TowDTO } from "../../../dtos/TowDTO";

type ProfileTowProps = {
  guincho: TowDTO;
};

function ProfileTow({ guincho }: ProfileTowProps) {
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

  function handleSave() {
    console.log("Dados do guincho:", formData);

    // Depois você pode fazer:
    // await updateTow(formData);

    setIsEditing(false);
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
