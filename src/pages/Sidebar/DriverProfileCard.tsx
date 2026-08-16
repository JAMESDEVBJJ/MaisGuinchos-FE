import { Star, Phone } from "lucide-react";
import "../../styles/DriverProfileCard.css";

function getInitials(name: string) {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface DriverProfileCardProps {
    name: string;
    rating: number;
    reviewsCount: number;
    phone: string;
    initials?: string;
}

export default function DriverProfileCard({
    name,
    rating,
    reviewsCount,
    phone,
    initials,
}: DriverProfileCardProps) {
    return (
        <div className="driver-profile">
            <p className="driver-profile__title">Perfil do Motorista</p>

            <div className="driver-profile__main">
                <div className="driver-profile__avatar">
                    <span>{initials || getInitials(name)}</span>
                </div>

                <div className="driver-profile__info">
                    <h3 className="driver-profile__name">{name}</h3>
                    <div className="driver-profile__rating">
                        <span className="driver-profile__stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} className="star-icon" />
                            ))}
                        </span>
                        <span className="driver-profile__rating-number">{rating.toFixed(1)}</span>
                        <span className="driver-profile__reviews">{reviewsCount} avaliações</span>
                    </div>
                </div>
            </div>

            <div className="driver-profile__contact">
                <p className="driver-profile__contact-label">Contato</p>
                <div className="driver-profile__phone">
                    <Phone size={16} />
                    <span>{phone}</span>
                </div>
            </div>
        </div>
    );
}