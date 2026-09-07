const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<void> | null = null;

/** Loads the Razorpay Checkout script exactly once, even across repeated calls. */
export function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay Checkout can only be loaded in the browser."),
    );
  }
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(
        new Error(
          "Could not load the payment gateway. Please check your connection and try again.",
        ),
      );
    };
    document.body.appendChild(script);
  });
  return loadPromise;
}

export type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayFailureResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: Record<string, unknown>;
  };
};

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayFailureResponse) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

/** Opens the Razorpay Checkout modal. Requires loadRazorpayCheckout() to have resolved first. */
export function openRazorpayCheckout(
  options: RazorpayCheckoutOptions,
  onFailure: (response: RazorpayFailureResponse) => void,
) {
  if (!window.Razorpay) {
    throw new Error("Razorpay Checkout script is not loaded.");
  }
  const instance = new window.Razorpay(options);
  instance.on("payment.failed", onFailure);
  instance.open();
}
