"use client";

import { useState, useEffect } from "react";
import TabelaCVs from "../components/tabelaCVs";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockCVs = [
  { id: 1, nome: "Pedro Carvalho", score: 92, fortes: "bla", fracos: "blu", sugestoes: "blablu" },
  { id: 2, nome: "Ana Souza", score: 85, fortes: "bla", fracos: "blu", sugestoes: "blablu" },
  { id: 3, nome: "Carlos Lima", score: 78, fortes: "bla", fracos: "blu", sugestoes: "blablu" },
];

export default function Home() {
  const [cvs, setCvs] = useState(mockCVs);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchCVs = async () => {
    try {
      const response = await fetch("https://sua-api.com/cvs");
      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      setCvs(data);
    } catch (error) {
      console.error("❌ Erro ao buscar dados da API, usando mock:", error);
      setCvs(mockCVs);
    }
  };

  useEffect(() => {
    fetchCVs();
    const interval = setInterval(fetchCVs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files).filter(file => file.name.endsWith(".md")));
    }
  };

  const processFilesAndUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo Markdown (.md).");
      return;
    }

    setUploading(true);

    for (const file of selectedFiles) {
      try {
        const text = await file.text();
        console.log(`📄 Conteúdo de ${file.name}:`, text);

        const response = await fetch("https://sua-api.com/processar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, content: text }),
        });

        if (!response.ok) throw new Error(`Erro ao enviar ${file.name}`);

        const data = await response.json();
        console.log(`✅ ${file.name} enviado com sucesso:`, data);
      } catch (error) {
        console.error(`❌ Erro no arquivo ${file.name}:`, error);
      }
    }

    setUploading(false);
    setUploadModalOpen(false);
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen bg-[#FFECF2] flex flex-col items-center p-8 w-full">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#E6007C]">Lista de Candidatos</h1>
        <Button
          onClick={() => setUploadModalOpen(true)}
          className="bg-[#FE2B8F] text-white px-4 py-2 rounded-lg hover:bg-[#E6007C]"
        >
          <Upload className="w-5 h-5 mr-2" /> Importar
        </Button>
      </div>

      <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="bg-[#FFECF2] border border-[#FF6D94]">
          <DialogHeader>
            <DialogTitle className="text-[#E6007C]">Importar Arquivos</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <input
              type="file"
              multiple
              accept=".md"
              onChange={handleFileChange}
              className="border border-[#FF6D94] p-2 w-full rounded-lg bg-[#FFC2D0] text-[#333333]"
            />
            {selectedFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-[#333333]">📄 {file.name}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
                className="border border-[#FF9ABD] text-[#E6007C] px-4 py-2 rounded-lg hover:bg-[#FFC2D0]"
              >
                Cancelar
              </Button>
              <Button
                onClick={processFilesAndUpload}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg text-white ${
                  uploading ? "bg-gray-400" : "bg-[#FE2B8F] hover:bg-[#E6007C]"
                }`}
              >
                {uploading ? "Enviando..." : "Fazer Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <TabelaCVs cvs={cvs} />
      </div>
    </div>
  );
}
