import { useEffect, useState } from "react";
import axios from "axios";
import { UseSession } from "../contexts/SessionContext";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PlanAccessResult {
    hasAccess:  boolean;
    daysLeft:   number | null;
    expiresAt:  Date   | null;
    isExpired:  boolean;
    loading:    boolean;
}

export interface MembershipState {
    loading:        boolean;
    purchases:      string[];                    // array completo de Firebase claims
    purchaseExpiry: Record<string, string>;      // { pro: "2026-11-28T..." }
    voucherCount:   number;                      // cantidad de vouchers disponibles
    plans:          Record<string, PlanAccessResult>; // acceso por planId
}

// ─── Helper: calcular acceso de un plan ──────────────────────────────────────

function calcPlanAccess(
    planId:        string,
    purchases:     string[],
    expiry:        Record<string, string>
): PlanAccessResult {
    const hasPlan = purchases.includes(planId);

    if (!hasPlan) {
        return { hasAccess: false, daysLeft: null, expiresAt: null, isExpired: false, loading: false };
    }

    // Voucher — no tiene expiración por tiempo
    if (planId === "voucher") {
        return { hasAccess: true, daysLeft: null, expiresAt: null, isExpired: false, loading: false };
    }

    const expiryStr = expiry[planId];
    if (!expiryStr) {
        // Tiene el plan en purchases pero sin fecha de expiración (compra antigua)
        // se considera vigente para no romper usuarios existentes
        return { hasAccess: true, daysLeft: null, expiresAt: null, isExpired: false, loading: false };
    }

    const expiresAt = new Date(expiryStr);
    const now       = new Date();
    const isExpired = expiresAt < now;
    const msLeft    = expiresAt.getTime() - now.getTime();
    const daysLeft  = isExpired ? 0 : Math.ceil(msLeft / (1000 * 60 * 60 * 24));

    return {
        hasAccess: !isExpired,
        daysLeft:  isExpired ? 0 : daysLeft,
        expiresAt,
        isExpired,
        loading:   false,
    };
}

// ─── Hook principal: UNA sola llamada a /api/refresh-claims ──────────────────

const PLAN_IDS = ["starter", "pro", "elite", "b2b_seis", "b2b_doce", "voucher"];

export const useMembership = (): MembershipState => {
    const { user } = UseSession();
    const [state, setState] = useState<MembershipState>({
        loading:        true,
        purchases:      [],
        purchaseExpiry: {},
        voucherCount:   0,
        plans:          {},
    });

    useEffect(() => {
        if (!user) {
            setState({ loading: false, purchases: [], purchaseExpiry: {}, voucherCount: 0, plans: {} });
            return;
        }

        const fetch = async () => {
            try {
                // Una sola llamada — el backend limpia vencidos y devuelve claims frescas
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/refresh-claims`,
                    { withCredentials: true }
                );

                const purchases:      string[]              = data.purchases      || [];
                const purchaseExpiry: Record<string, string> = data.purchaseExpiry || {};

                // Contar vouchers — pueden haber N en el array
                const voucherCount = purchases.filter((p: string) => p === "voucher").length;

                // Calcular acceso para cada plan de una vez
                const plans: Record<string, PlanAccessResult> = {};
                for (const planId of PLAN_IDS) {
                    plans[planId] = calcPlanAccess(planId, purchases, purchaseExpiry);
                }

                setState({ loading: false, purchases, purchaseExpiry, voucherCount, plans });

            } catch (err) {
                console.error("[useMembership] Error:", err);
                setState({ loading: false, purchases: [], purchaseExpiry: {}, voucherCount: 0, plans: {} });
            }
        };

        fetch();
    }, [user]);

    return state;
};

// ─── Hook individual (mantiene compatibilidad con código existente) ───────────
// Llama a useMembership internamente — sin llamadas extra

export const usePlanAccess = (planId: string): PlanAccessResult => {
    const membership = useMembership();
    if (membership.loading) {
        return { hasAccess: false, daysLeft: null, expiresAt: null, isExpired: false, loading: true };
    }
    return membership.plans[planId] ?? { hasAccess: false, daysLeft: null, expiresAt: null, isExpired: false, loading: false };
};

// ─── Formatear días restantes ─────────────────────────────────────────────────

export const formatDaysLeft = (daysLeft: number | null): string => {
    if (daysLeft === null) return "";
    if (daysLeft === 0)    return "VENCIDO";
    if (daysLeft === 1)    return "1 DÍA RESTANTE";
    if (daysLeft <= 7)     return `${daysLeft} DÍAS RESTANTES`;
    if (daysLeft <= 30) {
        const weeks = Math.floor(daysLeft / 7);
        return `${weeks} SEMANA${weeks > 1 ? "S" : ""} RESTANTE${weeks > 1 ? "S" : ""}`;
    }
    const months = Math.floor(daysLeft / 30);
    return `${months} MES${months > 1 ? "ES" : ""} RESTANTE${months > 1 ? "S" : ""}`;
};