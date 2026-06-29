import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import { UseSession } from "./SessionContext";

interface Coupon {
    code:         string;
    discount:     number;
    type:         'single_use' | 'date_limited' | 'limited_uses';
    expiryDate?:  Date;
    appliedAt?:   Date;
    allowedPlans?: string[];
    scope?:       string | string[];
}

interface CartContextType {
    appliedCoupon: Coupon | null;
    applyCoupon:   (code: string, planIds: string[]) => Promise<string>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = UseSession();

    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    const applyCoupon = async (code: string, planIds: string[]): Promise<string> => {
        if (!user) return "Debes iniciar sesión para aplicar cupones 🔴";

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/coupons/validate`,
                {
                    code,
                    email:  user.email,
                    planId: planIds,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setAppliedCoupon({
                    code:         response.data.coupon.code,
                    discount:     response.data.coupon.discount,
                    type:         response.data.coupon.type,
                    scope:        response.data.coupon.scope,
                    allowedPlans: response.data.coupon.allowedPlans,
                    appliedAt:    new Date(),
                });
                return response.data.message;
            }

            return "Error inesperado";

        } catch (error: any) {
            setAppliedCoupon(null);
            return error.response?.data?.message || "Error al validar cupón 🔴";
        }
    };

    return (
        <CartContext.Provider value={{ appliedCoupon, applyCoupon }}>
            {children}
        </CartContext.Provider>
    );
};

export const UseCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("UseCart debe usarse dentro de CartProvider");
    return context;
};