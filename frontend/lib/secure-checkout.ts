import type { CodingProblem, JsonValue } from "./coding-problems.ts";

const fixture = (request: Record<string, JsonValue>, sessionUserId: JsonValue = "learner", ownerId = "learner", stock = 3, catalogPriceCents = 1200) => ({
  sessionUserId,
  order: { ownerId, catalogPriceCents, stock },
  request,
});

export const secureCheckoutProblem: CodingProblem = {
  slug: "secure-checkout", title: "A checkout that protects the rules", topic: "Business logic & security", level: "Developing",
  description: "A shop accepts a price sent by the browser and never checks who owns the order. Repair its decision function. This is real Python practice using fictional server data, not a live checkout or an authentication service.",
  contract: 'Apply the four guards below in order and return immediately when a guard rejects the request. Otherwise return exactly {"status":200,"totalCents":quantity * order.catalogPriceCents}. Ignore all other request fields.',
  constraints: [
    'Guard 1 — identity: if sessionUserId is null, return {"status":401,"error":"sign_in_required"}.',
    'Guard 2 — ownership: if sessionUserId differs from order.ownerId, return {"status":403,"error":"forbidden"}.',
    'Guard 3 — quantity: if request.quantity is missing, is not a Python int (booleans do not count), or is less than 1, return {"status":400,"error":"invalid_quantity"}.',
    'Guard 4 — stock: if quantity exceeds order.stock, return {"status":409,"error":"out_of_stock"}.',
    "The outer structure, order fields and request object are valid. sessionUserId is either null or a nonempty string. request.quantity may be any JSON value or absent.",
    "order.catalogPriceCents is an integer from 0 to 100,000; stock is an integer from 0 to 100. Use integer cents, not decimal currency arithmetic.",
    "sessionUserId and order represent trusted server-side facts in this exercise; request is untrusted client input. A real API must load identity from its verified session and order data from its database, never accept those facts from the client.",
    "Use the exact check order even when several checks fail. Do not reveal stock or quantity errors before checking ownership.",
    "This function only makes a decision. It does not charge money or reserve stock. Real concurrent checkout needs transactional stock updates, idempotency and server-side authorization.",
  ],
  hints: [
    "Draw a line between session/order and request. Which side is allowed to decide the owner and price?",
    "What should happen if an unauthenticated caller also sends an invalid quantity? Follow the specified check order.",
    "What does Python consider True to be? Compare type(value) with isinstance(value, int) before deciding whether it is a quantity.",
    "Try quantity equal to stock, then one more than stock. What changes at the boundary?",
    "If every check passes, which price belongs in the multiplication?",
  ],
  tests: [
    { name: "Owned order at catalog price", input: fixture({ quantity: 2, unitPriceCents: 1200 }), expected: { status: 200, totalCents: 2400 } },
    { name: "Client price tampering", input: fixture({ quantity: 2, unitPriceCents: 1 }), expected: { status: 200, totalCents: 2400 } },
    { name: "Another catalog price", input: fixture({ quantity: 2, unitPriceCents: 1 }, "learner", "learner", 3, 1750), expected: { status: 200, totalCents: 3500 } },
    { name: "A catalog-approved free item", input: fixture({ quantity: 1, unitPriceCents: 999 }, "learner", "learner", 3, 0), expected: { status: 200, totalCents: 0 } },
    { name: "Authentication precedes validation", input: fixture({ quantity: -1 }, null, "someone-else"), expected: { status: 401, error: "sign_in_required" } },
    { name: "Forged client ownership", input: fixture({ quantity: 1, ownerId: "learner" }, "learner", "someone-else"), expected: { status: 403, error: "forbidden" } },
    { name: "Ownership precedes stock disclosure", input: fixture({ quantity: 99 }, "learner", "someone-else", 0), expected: { status: 403, error: "forbidden" } },
    { name: "Missing quantity", input: fixture({}), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Negative quantity", input: fixture({ quantity: -1 }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Zero quantity", input: fixture({ quantity: 0 }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "A boolean is not a quantity", input: fixture({ quantity: true }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "A numeric string is not an integer", input: fixture({ quantity: "2" }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Fractional quantity", input: fixture({ quantity: 1.5 }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Null quantity", input: fixture({ quantity: null }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Structured quantity", input: fixture({ quantity: { value: 2 } }), expected: { status: 400, error: "invalid_quantity" } },
    { name: "Exactly available stock", input: fixture({ quantity: 3 }), expected: { status: 200, totalCents: 3600 } },
    { name: "Above available stock", input: fixture({ quantity: 4 }), expected: { status: 409, error: "out_of_stock" } },
    { name: "No stock", input: fixture({ quantity: 1 }, "learner", "learner", 0), expected: { status: 409, error: "out_of_stock" } },
  ],
  debugging: {
    code: 'def solve(data):\n    request = data["request"]\n    quantity = request.get("quantity", 0)\n    return {"status": 200, "totalCents": quantity * request.get("unitPriceCents", 0)}\n',
    scenario: "The deliberately unsafe starter reads its price from the client. Use the editor to inspect its failures, then enforce the business contract. The displayed status codes are returned data, not real HTTP responses.",
    vocabulary: "Authentication establishes identity. Authorization checks permission for a particular action or object. An invariant is a rule that must stay true. A guard rejects a request before later work. Python None represents JSON null; bool is a subclass of int, so isinstance(True, int) is true.",
    prediction: { prompt: "The client sends quantity 2 and unitPriceCents 1. What total does the original starter return?", options: ["2400 cents", "2 cents", "It rejects the request"], correct: 1, feedback: ["That is the catalog total. Which field does the starter actually read?", "Yes. The client controls the price used by this code.", "There are no rejection guards in the starter. Follow the multiplication."] },
    diagnosis: { prompt: "A signed-in caller requests another customer's order. What should happen before quantity or stock checks?", options: ["Trust ownerId in the request", "Return forbidden after comparing the verified identity with the stored owner", "Check whether the submitted price looks reasonable"], correct: 1, feedback: ["The caller can change request fields. Which data is trusted?", "Correct. Signing in does not authorize every order; reject before revealing order details.", "Price validation does not establish ownership. Start at the trust boundary."] },
    review: ["Which facts must a real server obtain independently of the request?", "Which test would catch removing the ownership guard? Which would catch trusting the client price?", "Why can isinstance(value, int) accept a boolean in Python?", "If two callers see the last item simultaneously, why is checking stock alone insufficient?", "How would a retried payment request avoid charging twice? Explain the need before choosing a tool."],
  },
};
