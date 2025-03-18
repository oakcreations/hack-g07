import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CV {
  id: number;
  nome: string;
  score: number;
  fortes: string;
  fracos: string;
  sugestoes: string;
}

interface TabelaCVsProps {
  cvs: CV[];
}

export default function TabelaCVs({ cvs }: TabelaCVsProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  const handleOpenModal = (id: number) => {
    const cv = cvs.find((item) => item.id === id);
    setSelectedCV(cv || null);
    setModalOpen(true);
  };

  return (
    <div className="mt-[50px] mx-[30px] border border-[#FF6D94] rounded-lg shadow-lg p-4 bg-[#FFECF2]">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-[#FFC2D0]">
            <TableHead className="w-[100px] border border-[#FF9ABD] px-4 py-2 text-[#E6007C] font-bold">
              ID
            </TableHead>
            <TableHead className="border border-[#FF9ABD] px-4 py-2 text-[#E6007C] font-bold">
              Nome
            </TableHead>
            <TableHead className="border border-[#FF9ABD] px-4 py-2 text-[#E6007C] font-bold">
              Score
            </TableHead>
            <TableHead className="text-right border border-[#FF9ABD] px-4 py-2 text-[#E6007C] font-bold">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cvs.map((cv: CV) => (
            <TableRow key={cv.id} className="hover:bg-[#FFECF2]">
              <TableCell className="font-medium border border-[#FF9ABD] px-4 py-2 text-[#333333]">
                {cv.id}
              </TableCell>
              <TableCell className="border border-[#FF9ABD] px-4 py-2 text-[#333333]">
                {cv.nome}
              </TableCell>
              <TableCell className="border border-[#FF9ABD] px-4 py-2 text-[#333333]">
                {cv.score}
              </TableCell>
              <TableCell className="text-right border border-[#FF9ABD] px-4 py-2">
                <Button
                  className="bg-[#FE2B8F] text-white px-4 py-2 rounded-lg hover:bg-[#E6007C]"
                  onClick={() => handleOpenModal(cv.id)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#FFECF2] border border-[#FF6D94]">
          <DialogHeader>
            <DialogTitle className="text-[#E6007C]">Detalhes do CV</DialogTitle>
          </DialogHeader>
          {selectedCV ? (
            <div className="p-4">
              <p className="text-[#333333]">
                <strong>ID:</strong> {selectedCV.id}
              </p>
              <p className="text-[#333333]">
                <strong>Nome:</strong> {selectedCV.nome}
              </p>
              <p className="text-[#333333]">
                <strong>Score:</strong> {selectedCV.score}
              </p>
              <p className="text-[#E6007C]">
                <strong>Pontos fortes:</strong> {selectedCV.fortes}
              </p>
              <p className="text-[#A60058]">
                <strong>Pontos Fracos:</strong> {selectedCV.fracos}
              </p>
              <p className="text-[#D63275]">
                <strong>Sugestões:</strong> {selectedCV.sugestoes}
              </p>
            </div>
          ) : (
            <p className="text-center text-[#333333]">Carregando...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
