import { Star, Phone } from "lucide-react";
import "../../styles/UserProfileCard.css";

function getInitials(name: string) {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface UserProfileCardProps {
    name: string;
    phone: string;
    initials?: string;
    role: "Motorista" | "Cliente";
    rating?: number;
    reviewsCount?: number;
}

export default function UserProfileCard({
    name,
    phone,
    initials,
    role,
    rating,
    reviewsCount,
}: UserProfileCardProps) {
    const showRating =
        role === "Motorista" //&& rating !== undefined && reviewsCount !== undefined;

    return (
        <div className="user-profile">
            <p className="user-profile__title">
                Perfil do {role}
            </p>

            <div className="user-profile__main">
                <div className="user-profile__avatar">
                    <span>{initials || getInitials(name)}</span>
                </div>

                <div className="user-profile__info">
                    <h3 className="user-profile__name">
                        {name}
                    </h3>

                    {showRating && (
                        <div className="user-profile__rating">
                            <span className="user-profile__stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className="star-icon"
                                    />
                                ))}
                            </span>

                            <span className="user-profile__rating-number">
                                {rating?.toFixed(1)}
                            </span>

                            <span className="user-profile__reviews">
                                {reviewsCount} avaliações
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="user-profile__contact">

                <p className="user-profile__contact-label">
                    Contato
                </p>

                <div className="user-profile__phone">
                    <Phone size={16} />
                    <span>{phone}</span>
                </div>
            </div>
        </div>
    );
}