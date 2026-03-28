/**
 * Telr Payment Gateway Integration
 * Documentation: https://telr.com/support/knowledge-base/
 */

export interface TelrConfig {
  storeId: string;
  authKey: string;
  apiUrl: string;
  testMode: boolean;
}

export interface TelrOrderRequest {
  ivp_method: "create";
  ivp_store: string;
  ivp_authkey: string;
  ivp_cart: string;
  ivp_test: string;
  ivp_amount: string;
  ivp_currency: string;
  ivp_desc: string;
  return_auth: string;
  return_can: string;
  return_decl: string;
  bill_fname?: string;
  bill_sname?: string;
  bill_addr1?: string;
  bill_city?: string;
  bill_country?: string;
  bill_email?: string;
  ivp_trantype?: string;
  ivp_framed?: string;
}

export interface TelrOrderResponse {
  order: {
    ref: string;
    url: string;
    cartid: string;
  };
  trace?: string;
  error?: {
    note: string;
    message: string;
  };
}

export const telrConfig: TelrConfig = {
  storeId: process.env.TELR_STORE_ID || "",
  authKey: process.env.TELR_AUTH_KEY || "",
  apiUrl: process.env.TELR_API_URL || "https://secure.telr.com/gateway/order.json",
  testMode: process.env.TELR_TEST_MODE === "true",
};

/**
 * Create a Telr payment order
 */
export async function createTelrOrder(
  amount: number,
  description: string,
  cartId: string,
  customerEmail?: string,
  customerName?: string
): Promise<TelrOrderResponse> {
  const orderData: TelrOrderRequest = {
    ivp_method: "create",
    ivp_store: telrConfig.storeId,
    ivp_authkey: telrConfig.authKey,
    ivp_cart: cartId,
    ivp_test: telrConfig.testMode ? "1" : "0",
    ivp_amount: amount.toFixed(2),
    ivp_currency: "EUR",
    ivp_desc: description,
    return_auth: `${process.env.NEXT_PUBLIC_SITE_URL}/api/telr/callback?status=success`,
    return_can: `${process.env.NEXT_PUBLIC_SITE_URL}/api/telr/callback?status=cancelled`,
    return_decl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/telr/callback?status=declined`,
    ivp_trantype: "sale",
    ivp_framed: "2",
  };

  if (customerEmail) {
    orderData.bill_email = customerEmail;
  }

  if (customerName) {
    const [firstName, ...lastNameParts] = customerName.split(" ");
    orderData.bill_fname = firstName;
    orderData.bill_sname = lastNameParts.join(" ") || firstName;
  }

  const response = await fetch(telrConfig.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Telr API error: ${response.statusText}`);
  }

  const data: TelrOrderResponse = await response.json();

  if (data.error) {
    throw new Error(`Telr error: ${data.error.message}`);
  }

  return data;
}

/**
 * Verify Telr transaction status
 */
export async function verifyTelrTransaction(orderRef: string): Promise<any> {
  const verifyData = {
    ivp_method: "check",
    ivp_store: telrConfig.storeId,
    ivp_authkey: telrConfig.authKey,
    order_ref: orderRef,
  };

  const response = await fetch(telrConfig.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verifyData),
  });

  if (!response.ok) {
    throw new Error(`Telr verification error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Format amount for display
 */
export const formatAmount = (amount: number, currency: string = "EUR"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};