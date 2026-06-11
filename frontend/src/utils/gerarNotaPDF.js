import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera e faz download do PDF de uma Nota Fiscal.
 * @param {object} nota - Objeto da nota fiscal com todos os dados
 */
export async function gerarNotaPDF(nota) {
  const fmt = v => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
  const fmtDT = dt => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Monta o HTML da nota em um div temporário (fora da tela)
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    background: #ffffff;
    font-family: 'Geist', 'Inter', sans-serif;
    color: #0b1c30;
    padding: 40px;
    box-sizing: border-box;
  `;

  const statusColor = {
    autorizada: '#16a34a',
    pendente:   '#d97706',
    cancelada:  '#dc2626',
    rejeitada:  '#dc2626',
  };
  const status = nota.status_Nota?.toLowerCase() || 'pendente';
  const cor = statusColor[status] || '#6b7280';

  const itensHtml = (nota.itens || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
      <td style="padding:8px 12px; font-size:12px;">${item.numeroItem || i + 1}</td>
      <td style="padding:8px 12px; font-size:12px;">
        <strong>${item.descricaoProduto || '—'}</strong><br/>
        <span style="color:#6b7280; font-size:11px;">${item.codigoBarra || ''}</span>
      </td>
      <td style="padding:8px 12px; font-size:12px; text-align:center;">${item.quantidade || 1}</td>
      <td style="padding:8px 12px; font-size:12px; text-align:right;">${fmt(item.valorBrutoItem)}</td>
      <td style="padding:8px 12px; font-size:12px; text-align:right; color:#dc2626;">${item.desconto > 0 ? `− ${fmt(item.desconto)}` : '—'}</td>
      <td style="padding:8px 12px; font-size:12px; text-align:right; font-weight:bold;">${fmt(item.valorLiquidoItem)}</td>
    </tr>
  `).join('');

  const impostosHtml = (nota.impostos || []).map(imp => `
    <tr>
      <td style="padding:6px 12px; font-size:12px; font-weight:600; color:#3525cd;">${imp.tipoImposto}</td>
      <td style="padding:6px 12px; font-size:12px; text-align:right;">${fmt(imp.baseCalculo)}</td>
      <td style="padding:6px 12px; font-size:12px; text-align:right;">${imp.aliquota}%</td>
      <td style="padding:6px 12px; font-size:12px; text-align:right; font-weight:bold;">${fmt(imp.valorCalculado)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div style="border:2px solid #e2e8f0; border-radius:12px; overflow:hidden;">

      <!-- Cabeçalho -->
      <div style="background:#3525cd; padding:24px 32px; display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div style="font-size:24px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">SmartPDV</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.7); margin-top:2px;">Sistema de Gestão e Ponto de Venda</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px; font-weight:800; color:#ffffff;">NF-e #${nota.nf_numero}</div>
          <div style="margin-top:6px; display:inline-block; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); border-radius:20px; padding:3px 12px; font-size:11px; font-weight:700; color:#ffffff; text-transform:uppercase; letter-spacing:0.5px;">
            ${nota.status_Nota || 'PENDENTE'}
          </div>
        </div>
      </div>

      <!-- Dados principais -->
      <div style="padding:24px 32px; background:#f8faff; border-bottom:1px solid #e2e8f0;">
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px;">
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Emitente</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${nota.loja || '—'}</div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">CPF / Destinatário</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${nota.cpf_Cliente || 'Consumidor Final'}</div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Data de Emissão</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${fmtDT(nota.data_Emissao)}</div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Série</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${nota.serieNf || '—'}</div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">CFOP</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${nota.cfop || '—'}</div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Ticket Venda</div>
            <div style="font-size:14px; font-weight:600; color:#0b1c30;">${nota.ticket_venda ? `#${nota.ticket_venda}` : '—'}</div>
          </div>
        </div>
      </div>

      <!-- Resumo financeiro -->
      <div style="padding:20px 32px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; background:#ffffff; border-bottom:1px solid #e2e8f0;">
        <div style="background:#f8faff; border:1px solid #e2e8f0; border-radius:8px; padding:14px; text-align:center;">
          <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; margin-bottom:6px;">Valor Bruto</div>
          <div style="font-size:18px; font-weight:800; color:#0b1c30;">${fmt(nota.valor_Bruto_Nota)}</div>
        </div>
        <div style="background:#fff5f5; border:1px solid #fecaca; border-radius:8px; padding:14px; text-align:center;">
          <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; margin-bottom:6px;">Total Impostos</div>
          <div style="font-size:18px; font-weight:800; color:#dc2626;">${fmt(nota.valor_Total_De_Imposto_A_Pagar)}</div>
        </div>
        <div style="background:#f0f4ff; border:1px solid #c7d2fe; border-radius:8px; padding:14px; text-align:center;">
          <div style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; margin-bottom:6px;">Valor Líquido</div>
          <div style="font-size:18px; font-weight:800; color:#3525cd;">${fmt(nota.valor_Liquido_Nota)}</div>
        </div>
      </div>

      <!-- Itens -->
      ${nota.itens?.length ? `
      <div style="padding:0; border-bottom:1px solid #e2e8f0;">
        <div style="padding:14px 32px; background:#f8faff; border-bottom:1px solid #e2e8f0;">
          <span style="font-size:12px; font-weight:700; color:#3525cd; text-transform:uppercase; letter-spacing:0.5px;">Itens da Nota (${nota.itens.length})</span>
        </div>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:left; text-transform:uppercase;">#</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:left; text-transform:uppercase;">Produto</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:center; text-transform:uppercase;">Qtd</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Bruto</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Desconto</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Líquido</th>
            </tr>
          </thead>
          <tbody>${itensHtml}</tbody>
          <tfoot>
            <tr style="background:#f8faff; border-top:2px solid #e2e8f0;">
              <td colspan="5" style="padding:10px 12px; font-size:12px; font-weight:700; color:#6b7280; text-align:right;">Total</td>
              <td style="padding:10px 12px; font-size:14px; font-weight:800; color:#3525cd; text-align:right;">${fmt(nota.valor_Liquido_Nota)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      ` : ''}

      <!-- Impostos -->
      ${nota.impostos?.length ? `
      <div style="padding:0; border-bottom:1px solid #e2e8f0;">
        <div style="padding:14px 32px; background:#f8faff; border-bottom:1px solid #e2e8f0;">
          <span style="font-size:12px; font-weight:700; color:#3525cd; text-transform:uppercase; letter-spacing:0.5px;">Detalhamento de Impostos</span>
        </div>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:left; text-transform:uppercase;">Tipo</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Base de Cálculo</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Alíquota</th>
              <th style="padding:10px 12px; font-size:11px; font-weight:700; color:#6b7280; text-align:right; text-transform:uppercase;">Valor</th>
            </tr>
          </thead>
          <tbody>${impostosHtml}</tbody>
        </table>
      </div>
      ` : ''}

      <!-- Rodapé -->
      <div style="padding:16px 32px; background:#f8faff; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:11px; color:#9ca3af;">
          Gerado pelo SmartPDV · ${new Date().toLocaleString('pt-BR')}
        </div>
        <div style="font-size:11px; color:#9ca3af; font-weight:600;">
          NF-e #${nota.nf_numero} · Série ${nota.serieNf}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth   = pageWidth;
    const imgHeight  = (canvas.height * imgWidth) / canvas.width;

    // Suporte a múltiplas páginas se a nota for longa
    let heightLeft = imgHeight;
    let posY = 0;

    pdf.addImage(imgData, 'PNG', 0, posY, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      posY -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, posY, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`NF-e_${nota.nf_numero}_${nota.loja || 'SmartPDV'}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
