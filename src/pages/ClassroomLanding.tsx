import { useNavigate } from "react-router-dom";

const ClassroomLanding = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #270F57, #765F8F)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <img
          src="/logo.png"
          alt="Kids in Business"
          style={{ height: 56, width: "auto", marginBottom: 24 }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#c4a8e0",
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Η Τάξη Επιχειρεί
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          Ποιος είσαι;
        </h1>

        <p
          style={{
            fontSize: 15,
            color: "#c4a8e0",
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Επίλεξε τον ρόλο σου για να συνεχίσεις.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Εκπαιδευτικός */}
          <button
            onClick={() => navigate("/classroom/teacher")}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "24px 28px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 18,
              transition: "transform .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#f4eaff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              🏫
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#270F57", marginBottom: 4 }}>
                Είμαι εκπαιδευτικός
              </div>
              <div style={{ fontSize: 13, color: "#765F8F", lineHeight: 1.5 }}>
                Δημιούργησε session, επίλεξε σενάριο και παρακολούθησε τις ομάδες live.
              </div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 20, color: "#c4b0e0" }}>→</div>
          </button>

          {/* Μαθητής */}
          <button
            onClick={() => navigate("/classroom/student")}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: 20,
              padding: "24px 28px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 18,
              transition: "transform .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              🎒
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                Είμαι μαθητής
              </div>
              <div style={{ fontSize: 13, color: "#c4a8e0", lineHeight: 1.5 }}>
                Μπες στην τάξη σου, πάρε αποφάσεις και φτιάξε το δικό σου Lean Canvas.
              </div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 20, color: "rgba(255,255,255,0.4)" }}>→</div>
          </button>
        </div>

        <div style={{ marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          app.kidsinbusiness.gr
        </div>
      </div>
    </div>
  );
};

export default ClassroomLanding;
