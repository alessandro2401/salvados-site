import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Vehicle {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  tipo: "Sucata" | "Recuperável";
  status: string;
  valorFipe: number | null;
  valorSugerido: number | null;
  valorAlcancado: number | null;
  desvio: number | null;
}

function formatCurrency(cents: number | null | undefined): string {
  if (!cents) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Exportar relatório em PDF
 */
export function exportToPDF(vehicles: Vehicle[], leilaoNome?: string) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Leilão - Sistema Salvados', 14, 20);
  
  if (leilaoNome) {
    doc.setFontSize(12);
    doc.text(`Leilão: ${leilaoNome}`, 14, 28);
  }
  
  // Data do relatório
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 35);
  
  // Calcular totais
  const totalVeiculos = vehicles.length;
  const totalEsperado = vehicles.reduce((sum, v) => sum + (v.valorSugerido || 0), 0);
  const totalAlcancado = vehicles.reduce((sum, v) => sum + (v.valorAlcancado || 0), 0);
  const totalDesvio = totalAlcancado - totalEsperado;
  
  // KPIs
  doc.setFontSize(12);
  doc.text('Resumo Executivo', 14, 45);
  doc.setFontSize(10);
  doc.text(`Total de Veículos: ${totalVeiculos}`, 14, 52);
  doc.text(`Valor Esperado: ${formatCurrency(totalEsperado)}`, 14, 58);
  doc.text(`Valor Alcançado: ${formatCurrency(totalAlcancado)}`, 14, 64);
  doc.text(
    `Desvio Total: ${formatCurrency(totalDesvio)} (${totalDesvio >= 0 ? '+' : ''}${((totalDesvio / totalEsperado) * 100).toFixed(2)}%)`,
    14,
    70
  );
  
  // Tabela de veículos
  const tableData = vehicles.map(v => [
    v.placa,
    `${v.marca} ${v.modelo}`,
    v.ano.toString(),
    v.tipo,
    formatCurrency(v.valorFipe),
    formatCurrency(v.valorSugerido),
    formatCurrency(v.valorAlcancado),
    formatCurrency(v.desvio),
  ]);
  
  autoTable(doc, {
    head: [['Placa', 'Veículo', 'Ano', 'Tipo', 'FIPE', 'Sugerido', 'Alcançado', 'Desvio']],
    body: tableData,
    startY: 80,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    didParseCell: (data: any) => {
      if (data.column.index === 7 && data.row.index > 0) {
        const desvio = vehicles[data.row.index - 1]?.desvio || 0;
        data.cell.styles.textColor = desvio >= 0 ? [34, 197, 94] : [239, 68, 68];
      }
    }
  });
  
  // Rodapé
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Salvar
  const fileName = `relatorio-leilao-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Exportar relatório em Excel
 */
export function exportToExcel(vehicles: Vehicle[], leilaoNome?: string) {
  // Preparar dados
  const data = vehicles.map(v => ({
    'Placa': v.placa,
    'Marca': v.marca,
    'Modelo': v.modelo,
    'Ano': v.ano,
    'Tipo': v.tipo,
    'Status': v.status,
    'Valor FIPE': (v.valorFipe || 0) / 100,
    'Valor Sugerido': (v.valorSugerido || 0) / 100,
    'Valor Alcançado': (v.valorAlcancado || 0) / 100,
    'Desvio': (v.desvio || 0) / 100,
    'Desvio %': v.valorSugerido 
      ? (((v.desvio || 0) / v.valorSugerido) * 100).toFixed(2) + '%'
      : '0%',
  }));
  
  // Calcular totais
  const totalEsperado = vehicles.reduce((sum, v) => sum + (v.valorSugerido || 0), 0) / 100;
  const totalAlcancado = vehicles.reduce((sum, v) => sum + (v.valorAlcancado || 0), 0) / 100;
  const totalDesvio = totalAlcancado - totalEsperado;
  
  // Adicionar linha de totais
  data.push({
    'Placa': '',
    'Marca': '',
    'Modelo': '',
    'Ano': '' as any,
    'Tipo': '' as any,
    'Status': 'TOTAL',
    'Valor FIPE': '' as any,
    'Valor Sugerido': totalEsperado,
    'Valor Alcançado': totalAlcancado,
    'Desvio': totalDesvio,
    'Desvio %': totalEsperado ? ((totalDesvio / totalEsperado) * 100).toFixed(2) + '%' : '0%',
  });
  
  // Criar planilha
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Ajustar largura das colunas
  const colWidths = [
    { wch: 12 }, // Placa
    { wch: 15 }, // Marca
    { wch: 20 }, // Modelo
    { wch: 6 },  // Ano
    { wch: 12 }, // Tipo
    { wch: 20 }, // Status
    { wch: 15 }, // Valor FIPE
    { wch: 15 }, // Valor Sugerido
    { wch: 15 }, // Valor Alcançado
    { wch: 12 }, // Desvio
    { wch: 10 }, // Desvio %
  ];
  ws['!cols'] = colWidths;
  
  // Criar workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Leilão');
  
  // Adicionar aba de resumo
  const resumo = [
    ['Relatório de Leilão - Sistema Salvados'],
    [''],
    ['Data:', new Date().toLocaleDateString('pt-BR')],
    leilaoNome ? ['Leilão:', leilaoNome] : [],
    [''],
    ['Resumo Executivo'],
    ['Total de Veículos:', vehicles.length],
    ['Valor Esperado:', totalEsperado],
    ['Valor Alcançado:', totalAlcancado],
    ['Desvio Total:', totalDesvio],
    ['Desvio %:', totalEsperado ? ((totalDesvio / totalEsperado) * 100).toFixed(2) + '%' : '0%'],
  ].filter(row => row.length > 0);
  
  const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
  wsResumo['!cols'] = [{ wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
  
  // Salvar
  const fileName = `relatorio-leilao-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
