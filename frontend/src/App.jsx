import { useState } from "react";
import SubjectDetailPage from "./pages/SubjectDetailPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";

function App() {
  // null = lista de disciplinas; número = detalhe daquela disciplina
  const [subjectId, setSubjectId] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {subjectId === null ? (
        <SubjectsPage onOpenSubject={setSubjectId} />
      ) : (
        <SubjectDetailPage
          subjectId={subjectId}
          onBack={() => setSubjectId(null)}
        />
      )}
    </div>
  );
}

export default App;
