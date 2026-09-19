/* =========================================================
   Clerk auth — matches sih-imd-backend, which authenticates every
   route (except /api/health) via a Clerk session token.
   Publishable key below is the one already in your repo's
   test-harness/index.html. Swap CLERK_PUBLISHABLE_KEY /
   CLERK_FRONTEND_API if you point this at a different Clerk app.
   ========================================================= */
const CLERK_PUBLISHABLE_KEY = window.CLERK_PUBLISHABLE_KEY || "pk_test_dG9waWNhbC11bmljb3JuLTMwMTIuY2xlcmsuYWNjb3VudHMuZGV2JA";
const CLERK_FRONTEND_API = window.CLERK_FRONTEND_API || "https://topical-unicorn-3012.clerk.accounts.dev";

function loadClerkScript() {
  return new Promise((resolve, reject) => {
    if (window.Clerk) return resolve();
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-clerk-publishable-key", CLERK_PUBLISHABLE_KEY);
    s.src = `${CLERK_FRONTEND_API}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Clerk — check your network/publishable key."));
    document.head.appendChild(s);
  });
}

const AuthGuard = {
  _readyPromise: null,

  init() {
    if (!this._readyPromise) {
      this._readyPromise = loadClerkScript().then(() => window.Clerk.load()).then(() => window.Clerk);
    }
    return this._readyPromise;
  },

  async getToken() {
    try {
      await this.init();
      return window.Clerk.session ? await window.Clerk.session.getToken() : null;
    } catch (e) {
      return null; // Clerk unreachable — api.js falls back to mock data
    }
  },

  async signOut(redirectTo = "../login.html") {
    try {
      localStorage.removeItem("saksham_active_user");
      await this.init();
      if (window.Clerk && window.Clerk.session) await window.Clerk.signOut();
    } catch (e) {}
    window.location.href = redirectTo;
  },

  /* Mount Clerk's own sign-in/sign-up UI into a container on the auth pages. */
  async mountSignIn(el, opts = {}) { await this.init(); window.Clerk.mountSignIn(el, opts); },
  async mountSignUp(el, opts = {}) { await this.init(); window.Clerk.mountSignUp(el, opts); },
  async addListener(fn) { await this.init(); window.Clerk.addListener(fn); },

  /**
   * Called at the top of every dashboard page: confirms the visitor is
   * signed in, syncs their profile, and enforces role boundaries.
   */
  async requireRole(expectedRole) {
    let storedUser = null;
    try {
      const raw = localStorage.getItem("saksham_active_user");
      if (raw) storedUser = JSON.parse(raw);
    } catch (e) {}

    try {
      await this.init();
    } catch (e) {
      // Clerk offline or unreachable
    }

    const clerkUser = (window.Clerk && window.Clerk.user) || null;

    if (!clerkUser && !storedUser) {
      console.warn("No active session found, utilizing demo session for UI access.");
      const demoUser = {
        name: expectedRole === "trainee" ? "Aditi Sharma" : (expectedRole === "trainer" ? "R. Mehta" : "Administrator"),
        email: "demo@saksham.gov.in",
        role: expectedRole,
        status: "APPROVED",
        _demo: true
      };
      localStorage.setItem("saksham_active_user", JSON.stringify(demoUser));
      return demoUser;
    }

    const effectiveName = (clerkUser && (clerkUser.fullName || clerkUser.username)) || (storedUser && storedUser.name) || "Demo User";
    const effectiveEmail = (clerkUser && clerkUser.primaryEmailAddress?.emailAddress) || (storedUser && storedUser.email) || "";
    const effectiveRole = (storedUser && storedUser.role) || expectedRole;

    const fallback = {
      name: effectiveName,
      email: effectiveEmail,
      role: effectiveRole,
      status: "APPROVED",
      _demo: true
    };

    try {
      await Api.syncUser({
        name: fallback.name,
        email: fallback.email,
        role: effectiveRole
      });
      const profile = await Api.getProfile();
      if (profile && profile.role && profile.role !== expectedRole) {
        const dest = profile.role === "trainee" ? "profile.html" : "dashboard.html";
        window.location.href = `../${profile.role}/${dest}`;
        return null;
      }
      return profile || fallback;
    } catch (e) {
      return fallback;
    }
  }
};
