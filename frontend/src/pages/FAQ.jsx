import { useState } from 'react';

const SECOES = [
  {
    id: 'inicio',
    titulo: 'Primeiros Passos',
    icon: 'rocket_launch',
    cor: 'bg-primary/10 text-primary border-primary/20',
    perguntas: [
      {
        q: 'Como criar minha loja no SmartPDV?',
        a: 'Na tela de Login, clique em "Cadastrar Loja" e preencha os dados fiscais: Razão Social, CNPJ, Inscrição Estadual e Endereço. Após o cadastro, anote o ID da loja — ele será necessário para cadastrar funcionários.',
      },
      {
        q: 'Como cadastrar um funcionário?',
        a: 'Na tela de Login, clique em "Cadastrar Equipe". Preencha nome, e-mail, CPF, login, perfil de acesso e o ID da loja. O sistema possui 5 perfis: Admin, Gerente, Funcionário, Contabilidade e Matriz.',
      },
      {
        q: 'Qual a diferença entre os perfis de acesso?',
        a: 'Admin e Gerente têm acesso completo, incluindo cadastro de produtos. Funcionário realiza vendas e consultas. Contabilidade visualiza relatórios e notas fiscais. Matriz tem acesso à estrutura multi-loja.',
      },
    ],
  },
  {
    id: 'caixa',
    titulo: 'Abertura e Fechamento de Caixa',
    icon: 'account_balance_wallet',
    cor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    perguntas: [
      {
        q: 'Por que preciso abrir o caixa antes de vender?',
        a: 'O caixa controla o turno operacional. Todas as vendas são vinculadas à sessão de caixa aberta. Sem caixa aberto, o PDV fica bloqueado para evitar registros sem controle.',
      },
      {
        q: 'O que acontece ao fechar o caixa?',
        a: 'O sistema gera automaticamente um relatório com saldo inicial, saldo final e o total movimentado no turno. Esse relatório fica disponível na tela de Caixa.',
      },
      {
        q: 'Posso abrir mais de um caixa ao mesmo tempo?',
        a: 'Não. O sistema permite apenas um caixa aberto por vez por operador. Para múltiplos terminais simultâneos, cada operador deve fazer seu próprio login.',
      },
    ],
  },
  {
    id: 'venda',
    titulo: 'PDV e Vendas',
    icon: 'point_of_sale',
    cor: 'bg-blue-100 text-blue-700 border-blue-200',
    perguntas: [
      {
        q: 'Como adicionar produtos na venda?',
        a: 'No PDV Terminal, escaneie o código de barras com um leitor ou digite o código manualmente no campo de busca e pressione Enter. O produto será validado no estoque antes de ser adicionado.',
      },
      {
        q: 'Posso aplicar desconto em um item específico?',
        a: 'Sim. Cada item na lista de venda possui um campo de desconto em percentual (%). Basta digitar o valor e o sistema recalcula o subtotal em tempo real.',
      },
      {
        q: 'O CPF/CNPJ na nota é obrigatório?',
        a: 'Não. O campo é opcional. Quando preenchido, o documento do cliente é vinculado à Nota Fiscal emitida. Deixe em branco para vendas a consumidor final.',
      },
      {
        q: 'O que acontece se o estoque de um produto estiver zerado?',
        a: 'O sistema bloqueia a adição do produto na venda e exibe um alerta de "sem saldo". Você precisa realizar uma Entrada de Mercadoria antes de continuar.',
      },
    ],
  },
  {
    id: 'notafiscal',
    titulo: 'Nota Fiscal',
    icon: 'description',
    cor: 'bg-purple-100 text-purple-700 border-purple-200',
    perguntas: [
      {
        q: 'A nota fiscal é emitida automaticamente?',
        a: 'Sim. Ao finalizar o pagamento de uma venda, o sistema emite automaticamente uma NF-e vinculada à venda. Você também pode emitir notas avulsas pelo menu Nota Fiscal.',
      },
      {
        q: 'O que é o CFOP e qual devo usar?',
        a: 'CFOP é o código que identifica a natureza da operação fiscal. Para vendas internas use 5102 (mais comum). Para transferências entre lojas do mesmo estado use 5152, e entre estados 6152.',
      },
      {
        q: 'Como gerar o PDF de uma nota?',
        a: 'No histórico de Notas Fiscais, cada card possui um botão de PDF (ícone de arquivo). Clique nele para gerar e baixar o documento. O mesmo botão está disponível dentro do modal de detalhes da nota.',
      },
      {
        q: 'O que são as "Exceções de Imposto"?',
        a: 'São configurações que definem quais impostos (ICMS, PIS, COFINS, etc.) se aplicam a cada CFOP em sua loja. São obrigatórias para emissão de NF-e. Configure no menu Impostos antes de realizar vendas.',
      },
    ],
  },
  {
    id: 'estoque',
    titulo: 'Estoque e Produtos',
    icon: 'inventory_2',
    cor: 'bg-amber-100 text-amber-700 border-amber-200',
    perguntas: [
      {
        q: 'Como cadastrar um novo produto?',
        a: 'Acesse o menu Produtos e clique em "Novo Produto". Preencha a descrição, código de barras, SKU, preço de venda e custo. Apenas perfis Gerente, Admin e Matriz têm permissão para cadastrar produtos.',
      },
      {
        q: 'Como dar entrada de mercadoria no estoque?',
        a: 'Acesse Entrada de Mercadoria. As notas de transferência em trânsito aparecerão listadas. Clique em "Receber" na nota correspondente, adicione uma observação opcional e confirme. O estoque é atualizado automaticamente.',
      },
      {
        q: 'Como monitorar o estoque crítico?',
        a: 'Na tela de Estoque, os produtos com menos de 5 unidades são marcados como "Crítico" em vermelho. Produtos com até 20 unidades são marcados como "Baixo" em amarelo. O Dashboard também exibe um contador de alertas.',
      },
    ],
  },
  {
    id: 'pagamento',
    titulo: 'Formas de Pagamento',
    icon: 'payments',
    cor: 'bg-secondary-container text-on-secondary-container border-outline-variant',
    perguntas: [
      {
        q: 'Como cadastrar formas de pagamento?',
        a: 'Acesse o menu "Meios Pgto." (Meios de Pagamento). Selecione o tipo de operação (Dinheiro, PIX, Crédito, etc.), dê um nome descritivo e clique em Cadastrar. Os meios aparecem imediatamente no checkout do PDV.',
      },
      {
        q: 'Como funciona o parcelamento?',
        a: 'Ao selecionar uma forma de pagamento do tipo Crédito no checkout, o sistema exibe automaticamente um seletor de parcelas de 1x a 12x.',
      },
      {
        q: 'Por que o pagamento foi cancelado com erro de imposto?',
        a: 'Isso ocorre quando não existe uma Exceção de Imposto configurada para o CFOP 5102 na sua loja. A venda é cancelada automaticamente. Acesse o menu Impostos, cadastre a exceção e realize a venda novamente.',
      },
    ],
  },
];

function ItemFAQ({ q, a }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className={`border border-outline-variant/40 rounded-2xl overflow-hidden transition-all duration-200 ${aberto ? 'bg-surface-container-low' : 'bg-surface hover:border-primary/30'}`}>
      <button
        className="w-full flex items-center justify-between px-xl py-lg text-left gap-md"
        onClick={() => setAberto(v => !v)}
      >
        <span className="text-label-md font-semibold text-on-surface">{q}</span>
        <span className={`material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {aberto && (
        <div className="px-xl pb-lg">
          <div className="w-full h-px bg-outline-variant/30 mb-md" />
          <p className="text-body-md text-on-surface-variant leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [secaoAtiva, setSecaoAtiva] = useState('inicio');
  const [busca, setBusca] = useState('');

  const secaoFiltrada = SECOES.find(s => s.id === secaoAtiva);
  const perguntasFiltradas = busca.trim()
    ? SECOES.flatMap(s => s.perguntas.filter(p =>
        p.q.toLowerCase().includes(busca.toLowerCase()) ||
        p.a.toLowerCase().includes(busca.toLowerCase())
      ))
    : secaoFiltrada?.perguntas ?? [];

  return (
    <div className="p-xl max-w-[1200px] mx-auto space-y-xl">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">Central de Ajuda</h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">Perguntas frequentes e manual de uso do SmartPDV</p>
        </div>
        <a
          href="/dashboard/sobre"
          className="flex items-center gap-sm px-lg py-md bg-surface-container border border-outline-variant rounded-xl text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
          Sobre o Sistema
        </a>
      </div>

      {/* Hero search */}
      <div className="bg-primary rounded-2xl p-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-headline-md font-bold text-on-primary mb-sm">Como podemos ajudar?</h2>
          <p className="text-body-md text-on-primary/70 mb-lg">Busque por palavras-chave ou navegue pelas seções abaixo.</p>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar em todos os tópicos..."
              className="w-full min-h-[48px] pl-12 pr-md bg-surface-container-lowest rounded-xl text-body-md focus:border-primary input-focus-ring outline-none border border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">

        {/* Section nav */}
        {!busca.trim() && (
          <div className="lg:col-span-3">
            <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
              <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Categorias</p>
              </div>
              <div className="p-sm space-y-xs">
                {SECOES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSecaoAtiva(s.id)}
                    className={`w-full flex items-center gap-md px-md py-sm rounded-xl text-label-md font-semibold transition-all min-h-[44px] text-left ${
                      secaoAtiva === s.id
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    <span className="flex-1">{s.titulo}</span>
                    <span className={`text-[10px] font-bold px-xs py-xs rounded-full min-w-[20px] text-center ${secaoAtiva === s.id ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                      {s.perguntas.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className={busca.trim() ? 'col-span-12' : 'lg:col-span-9'}>
          {busca.trim() && (
            <div className="flex items-center gap-sm mb-lg px-xs">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <p className="text-body-sm text-on-surface-variant">
                {perguntasFiltradas.length} resultado{perguntasFiltradas.length !== 1 ? 's' : ''} para "<strong className="text-on-surface">{busca}</strong>"
              </p>
              <button onClick={() => setBusca('')} className="ml-auto text-label-md font-semibold text-primary hover:underline">
                Limpar
              </button>
            </div>
          )}

          {!busca.trim() && secaoFiltrada && (
            <div className="flex items-center gap-md mb-lg">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${secaoFiltrada.cor}`}>
                <span className="material-symbols-outlined text-[20px]">{secaoFiltrada.icon}</span>
              </div>
              <div>
                <h2 className="text-headline-md font-bold text-on-surface">{secaoFiltrada.titulo}</h2>
                <p className="text-body-sm text-on-surface-variant">{secaoFiltrada.perguntas.length} perguntas nesta seção</p>
              </div>
            </div>
          )}

          {perguntasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-2xl gap-lg text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-50">search_off</span>
              </div>
              <div>
                <p className="text-label-md font-semibold text-on-surface">Nenhum resultado encontrado</p>
                <p className="text-body-sm text-on-surface-variant mt-xs">Tente outras palavras-chave</p>
              </div>
            </div>
          ) : (
            <div className="space-y-sm">
              {perguntasFiltradas.map((item, i) => (
                <ItemFAQ key={i} q={item.q} a={item.a} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact footer */}
      <div className="bg-surface border border-outline-variant/40 rounded-2xl p-xl flex flex-col md:flex-row items-center justify-between gap-lg shadow-card">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
          </div>
          <div>
            <p className="text-label-md font-bold text-on-surface">Não encontrou o que precisava?</p>
            <p className="text-body-sm text-on-surface-variant">Entre em contato diretamente com o desenvolvedor</p>
          </div>
        </div>
        <a
          href="mailto:ogabriellima1999@gmail.com"
          className="flex items-center gap-sm px-xl min-h-[44px] bg-primary text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          Enviar E-mail
        </a>
      </div>
    </div>
  );
}
