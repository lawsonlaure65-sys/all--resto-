/**
 * Service de préparation à la certification fiscale e-SECeF / DGI Niger
 * 
 * Conforme aux directives de la Direction Générale des Impôts (DGI) de la République du Niger
 * pour la réforme de la facture certifiée normalisée.
 * 
 * RÈGLES DGI STRICTES :
 * 1. Ne génère pas de faux QR code SECeF localement.
 * 2. Ne transforme pas le NIF, le RCCM, le numéro de commande ou le montant en faux QR code officiel.
 * 3. Le QR code officiel ne s'affiche QUE lorsque secef_status === "certified" et que secef_qr_data existe.
 * 4. En attente de certification officielle, le reçu affiche lisiblement "Reçu non certifié SECeF".
 */

import { Order } from "../types";

export interface SecefConfig {
  apiUrl?: string;
  nim?: string;
  apiKey?: string;
  isConfigured: boolean;
}

export interface SecefCertificationResult {
  success: boolean;
  status: "certified" | "uncertified" | "pending" | "rejected";
  secef_code?: string;
  nim?: string;
  secef_qr_data?: string;
  certified_at?: string;
  message: string;
}

/**
 * Vérifie si la solution e-SECeF / SFE homologuée est configurée
 */
export function getSecefConfig(): SecefConfig {
  const envApiUrl = typeof process !== "undefined" ? process.env?.VITE_SECEF_API_URL : undefined;
  const envNim = typeof process !== "undefined" ? process.env?.VITE_SECEF_NIM : undefined;
  const envApiKey = typeof process !== "undefined" ? process.env?.VITE_SECEF_API_KEY : undefined;

  const isConfigured = Boolean(envApiUrl && envNim && envApiKey);

  return {
    apiUrl: envApiUrl,
    nim: envNim,
    apiKey: envApiKey,
    isConfigured,
  };
}

/**
 * Fonction préparée pour la future intégration avec l'API e-SECeF ou la passerelle homologuée DGI.
 * 
 * NOTE : N'est pas appelée automatiquement tant que les identifiants et l'API
 * officielle / solution homologuée ne sont pas configurés par Allôresto auprès de la DGI.
 */
export async function requestSecefCertification(
  orderId: string,
  orderData?: Partial<Order>
): Promise<SecefCertificationResult> {
  const config = getSecefConfig();

  // Si l'API officielle DGI n'est pas configurée, on retourne un statut uncertified clair
  if (!config.isConfigured) {
    return {
      success: false,
      status: "uncertified",
      message:
        "L'intégration e-SECeF / DGI Niger n'est pas encore configurée. Le reçu conserve son statut 'Reçu non certifié SECeF'.",
    };
  }

  try {
    const response = await fetch(`/api/secef/certify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        orderData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        status: "rejected",
        message: err.message || `Erreur serveur SECeF (HTTP ${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      status: "certified",
      secef_code: data.secef_code,
      nim: data.nim,
      secef_qr_data: data.secef_qr_data,
      certified_at: data.certified_at || new Date().toISOString(),
      message: "Facture certifiée avec succès auprès du système DGI.",
    };
  } catch (error: any) {
    console.warn("Erreur lors de la requête SECeF :", error);
    return {
      success: false,
      status: "uncertified",
      message: error?.message || "Erreur de connexion au service e-SECeF.",
    };
  }
}
