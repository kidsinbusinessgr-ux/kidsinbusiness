import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <button onClick={() => navigate(-1)} className="text-purple-600 text-sm mb-6 hover:underline">
          ← Πίσω
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Πολιτική Απορρήτου &amp; Όροι Χρήσης
        </h1>
        <p className="text-xs text-gray-400 mb-8">Τελευταία ενημέρωση: Αύγουστος 2026</p>
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">1. Υπεύθυνος Επεξεργασίας</h2>
            <p>Αρνιθενού Σταυρούλα — Kids in Business GR<br />
            Email: <a href="mailto:kidsinbusinessgr@gmail.com" className="text-purple-600 hover:underline">kidsinbusinessgr@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">2. Ποια δεδομένα συλλέγουμε</h2>
            <p className="mb-2">Κατά την εγγραφή στην ψηφιακή πλατφόρμα του βιβλίου, συλλέγουμε:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Όνομα παιδιού</li>
              <li>Ηλικία παιδιού</li>
              <li>Email γονέα / κηδεμόνα</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">3. Γιατί συλλέγουμε τα δεδομένα</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Παροχή πρόσβασης στο ψηφιακό υλικό του βιβλίου</li>
              <li>Παρακολούθηση προόδου του παιδιού</li>
              <li>Επικοινωνία με τον γονέα/κηδεμόνα εφόσον χρειαστεί</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">4. Χρόνος διατήρησης</h2>
            <p>Τα δεδομένα αποθηκεύονται για 2 χρόνια από την εγγραφή ή μέχρι να ζητήσετε τη διαγραφή τους.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">5. Τα δικαιώματά σας (GDPR)</h2>
            <p className="mb-2">Έχετε δικαίωμα:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Πρόσβασης στα δεδομένα σας</li>
              <li>Διόρθωσης ανακριβών δεδομένων</li>
              <li>Διαγραφής («δικαίωμα στη λήθη»)</li>
              <li>Φορητότητας δεδομένων</li>
            </ul>
            <p className="mt-2">Για αίτημα: <a href="mailto:kidsinbusinessgr@gmail.com" className="text-purple-600 hover:underline">kidsinbusinessgr@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">6. Ασφάλεια δεδομένων</h2>
            <p>Τα δεδομένα αποθηκεύονται σε ασφαλείς servers στην Ευρώπη (Supabase EU) με κρυπτογράφηση. Δεν μοιραζόμαστε δεδομένα με τρίτους.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">7. Cookies</h2>
            <p>Χρησιμοποιούμε μόνο τεχνικά cookies (localStorage) για τη λειτουργία της πλατφόρμας. Δεν χρησιμοποιούμε cookies διαφήμισης ή analytics τρίτων.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">8. Όροι Χρήσης</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Η πρόσβαση παρέχεται αποκλειστικά σε κατόχους του βιβλίου</li>
              <li>Απαγορεύεται η κοινοποίηση του κωδικού σε τρίτους</li>
              <li>Το περιεχόμενο προστατεύεται από πνευματικά δικαιώματα</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-2">9. Επικοινωνία</h2>
            <p>Kids in Business GR<br />
            <a href="mailto:kidsinbusinessgr@gmail.com" className="text-purple-600 hover:underline">kidsinbusinessgr@gmail.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
