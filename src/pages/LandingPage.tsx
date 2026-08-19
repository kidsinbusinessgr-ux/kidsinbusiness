import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: "#fff9e9", color: "#270F57", fontFamily: "'Inter', 'Helvetica Neue', sans-serif", minHeight: "100vh" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #270F57 0%, #765F8F 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>K</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#270F57" }}>kidsinbusiness<span style={{ color: "#765F8F" }}>.app</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/auth" style={{ padding: "10px 22px", borderRadius: 14, border: "1.5px solid #270F57", color: "#270F57", fontWeight: 600, fontSize: 14, textDecoration: "none", background: "transparent" }}>Είσοδος</Link>
          <Link to="/dashboard" style={{ padding: "10px 22px", borderRadius: 14, background: "#270F57", color: "#fff9e9", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </nav>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#f4eaff", color: "#765F8F", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", padding: "6px 16px", borderRadius: 20, marginBottom: 28 }}>ΑΠΟ ΤΗΝ ΙΔΕΑ ΣΤΗΝ ΠΡΑΞΗ</div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 800, lineHeight: 1.05, color: "#270F57", margin: "0 auto 24px", maxWidth: 820, letterSpacing: "-0.02em" }}>Χτίσε το Επιχειρηματικό Πλάνο. Μαζί.</h1>
        <p style={{ fontSize: 18, color: "#5a4070", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 40px" }}>Συνεργάσου με την ομάδα σου, μάθε Lean Canvas, και παρουσίασε την ιδέα σας με τρόπο που κάνει τους άλλους να θέλουν να ακούσουν.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ padding: "14px 32px", borderRadius: 14, background: "#270F57", color: "#fff9e9", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block" }}>Μπες στην ομάδα σου</Link>
          <Link to="/auth" style={{ padding: "14px 32px", borderRadius: 14, border: "1.5px solid #270F57", color: "#270F57", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block", background: "transparent" }}>Ζήτησε πρόσβαση</Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: "#8a6faa" }}>Για μαθητές 10–18 ετών και τους ανθρώπους που τους ανοίγουν δρόμους.</p>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 0" }}>
        <div style={{ background: "#f4eaff", borderRadius: 24, padding: "32px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#765F8F", textTransform: "uppercase", marginBottom: 6 }}>TEAM STUDIO / 01</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#270F57" }}>Σχολική Τσάντα 2.0</div>
              <div style={{ fontSize: 13, color: "#765F8F", marginTop: 4 }}>ΕΛΝΙΑΝ</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>Πρόοδος ομάδας</div>
              <div style={{ fontWeight: 800, fontSize: 28, color: "#270F57" }}>68%</div>
              <div style={{ height: 6, background: "#e0cff5", borderRadius: 3, marginTop: 6, width: 80 }}><div style={{ height: 6, background: "#765F8F", borderRadius: 3, width: "68%" }} /></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[{ label: "ΙΔΕΑ", text: "Μία τσάντα που σκέφτεται μαζί μας." }, { label: "ΠΕΛΑΤΗΣ", text: "Μαθητές που θέλουν πιο ανάλαφρες μέρες." }, { label: "ΕΠΟΜΕΝΟ", text: "5 συνεντεύξεις μέχρι την Παρασκευή." }].map((item) => (
              <div key={item.label} style={{ background: "#fffdf6", borderRadius: 14, padding: "14px 12px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#765F8F", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "#270F57", lineHeight: 1.4 }}>{item.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: "#fffdf6", borderRadius: 14, padding: "12px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#765F8F", textTransform: "uppercase" }}>ΡΟΛΟΣ</div>
            <div style={{ fontSize: 13, color: "#270F57" }}>Marketing · Ελένη</div>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 40px", textAlign: "center" }}>
        <p style={{ fontSize: 16, color: "#5a4070", marginBottom: 20 }}>Κάθε ομάδα έχει χώρο να δοκιμάσει τον δικό της τρόπο.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["Technical", "Finance", "Marketing", "Sales", "Operations"].map((role) => (
            <span key={role} style={{ padding: "8px 18px", borderRadius: 20, background: "#f4eaff", color: "#270F57", fontWeight: 600, fontSize: 14 }}>{role}</span>
          ))}
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "72px auto 0", padding: "0 40px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#765F8F", textTransform: "uppercase", marginBottom: 12 }}>Το Studio σας</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#270F57", marginBottom: 12, lineHeight: 1.1 }}>Μία ιδέα.<br />Τέσσερα εργαλεία.</h2>
        <p style={{ fontSize: 16, color: "#5a4070", maxWidth: 480, marginBottom: 36, lineHeight: 1.6 }}>Όχι άλλα χαρτιά που χάνονται. Ένας κοινός χώρος για να σκεφτείτε, να δοκιμάσετε και να αφηγηθείτε αυτό που φτιάχνετε.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[{ title: "Lean Canvas", desc: "Βάλτε την ιδέα σας σε μία καθαρή, δυνατή εικόνα.", icon: "◈", link: "/venture-builder" }, { title: "Elevator Pitch", desc: "Πείτε την ιστορία σας με λόγια που μένουν.", icon: "◎", link: "/student" }, { title: "Customer Discovery", desc: "Ρωτήστε, ακούστε και σχεδιάστε από αληθινές ανάγκες.", icon: "◐", link: "/student" }, { title: "Weekly Tasks", desc: "Μικρά βήματα που κάνουν την πρόοδο ορατή.", icon: "◑", link: "/actions" }].map((tool) => (
            <Link to={tool.link} key={tool.title} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fffdf6", borderRadius: 20, padding: "24px", border: "1.5px solid #f0e8d0", height: "100%" }}>
                <div style={{ fontSize: 24, marginBottom: 14, color: "#765F8F" }}>{tool.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#270F57", marginBottom: 8 }}>{tool.title}</div>
                <div style={{ fontSize: 14, color: "#5a4070", lineHeight: 1.5 }}>{tool.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "72px auto 0", padding: "0 40px", textAlign: "center" }}>
        <div style={{ background: "#f4eaff", borderRadius: 24, padding: "40px 48px", maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: "#270F57", lineHeight: 1.5, fontStyle: "italic", marginBottom: 16 }}>«Δεν μας έδωσε έτοιμες απαντήσεις. Μας έμαθε να κάνουμε καλύτερες ερωτήσεις.»</p>
          <p style={{ fontSize: 14, color: "#765F8F", fontWeight: 600 }}>— Μαρία, 14 · ομάδα Spark Lab</p>
        </div>
        <p style={{ marginTop: 32, fontSize: 15, color: "#5a4070", maxWidth: 480, margin: "24px auto 0" }}>Η καλή ιδέα γίνεται καλύτερη όταν την ακούν περισσότερα μυαλά.</p>
      </section>
      <section style={{ maxWidth: 1100, margin: "72px auto 0", padding: "0 40px 80px" }}>
        <div style={{ background: "#270F57", borderRadius: 24, padding: "48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#c4a8e0", marginBottom: 12 }}>ΓΙΑ ΕΚΠΑΙΔΕΥΤΙΚΟΥΣ</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff9e9", marginBottom: 12 }}>Είσαι εκπαιδευτικός;</h2>
            <p style={{ fontSize: 16, color: "#c4a8e0", maxWidth: 400, lineHeight: 1.5 }}>Δώσε στις ομάδες σου χώρο για πραγματική συνεργασία.</p>
          </div>
          <Link to="/teachers" style={{ padding: "14px 32px", borderRadius: 14, background: "#fff9e9", color: "#270F57", fontWeight: 700, fontSize: 16, textDecoration: "none", flexShrink: 0 }}>Είσοδος εκπαιδευτικού →</Link>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid #e8dfc8", padding: "24px 40px", maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#8a6faa" }}>© 2025 KidsInBusiness.gr</span>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ label: "Dashboard", to: "/dashboard" }, { label: "Προγράμματα", to: "/programs" }, { label: "Κοινότητα", to: "/community" }].map((link) => (
            <Link key={link.to} to={link.to} style={{ fontSize: 13, color: "#765F8F", textDecoration: "none", fontWeight: 500 }}>{link.label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
