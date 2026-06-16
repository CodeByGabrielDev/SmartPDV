export default function Sobre() {
  return (
    <div className="p-xl max-w-[900px] mx-auto space-y-xl">

      {/* Page Header */}
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">Sobre o SmartPDV</h1>
        <p className="text-body-sm text-on-surface-variant mt-xs">Conheça o projeto e o desenvolvedor por trás do sistema</p>
      </div>

      {/* Hero */}
      <div className="bg-primary rounded-2xl p-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex items-center gap-xl">
          <div className="w-20 h-20 rounded-2xl bg-on-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="material-symbols-outlined text-on-primary text-4xl">storefront</span>
          </div>
          <div>
            <h2 className="text-headline-md font-bold text-on-primary">SmartPDV</h2>
            <p className="text-body-md text-on-primary/70 mt-xs">Sistema de Gestão e Ponto de Venda</p>
            <div className="flex items-center gap-sm mt-md">
              <span className="px-sm py-xs rounded-full bg-on-primary/20 text-on-primary text-[11px] font-bold border border-on-primary/20">
                v1.0.0
              </span>
              <span className="px-sm py-xs rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-bold border border-emerald-400/30">
                Production
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre o projeto */}
      <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
        <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Sobre o Projeto</h2>
        </div>
        <div className="p-xl space-y-md">
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            O <strong className="text-on-surface">SmartPDV</strong> é um sistema completo de Ponto de Venda desenvolvido para pequenas e médias empresas que buscam uma solução moderna, eficiente e acessível para gestão de vendas, estoque e fiscal.
          </p>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            O sistema foi construído com foco em usabilidade, permitindo que operadores realizem vendas de forma ágil, controlem o estoque em tempo real e emitam Notas Fiscais Eletrônicas (NF-e) de forma automatizada.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-md pt-md">
            {[
              { icon: 'point_of_sale',      label: 'PDV Completo',     desc: 'Vendas rápidas com bipagem' },
              { icon: 'description',         label: 'NF-e Integrada',  desc: 'Emissão automática' },
              { icon: 'inventory_2',         label: 'Controle Estoque', desc: 'Alertas em tempo real' },
              { icon: 'account_balance_wallet', label: 'Gestão Caixa', desc: 'Turnos e relatórios' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="p-md bg-surface-container-low rounded-xl border border-outline-variant text-center">
                <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                <p className="text-label-md font-bold text-on-surface mt-sm">{label}</p>
                <p className="text-[11px] text-on-surface-variant mt-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stack tecnológica */}
      <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
        <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">code</span>
          <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Stack Tecnológica</h2>
        </div>
        <div className="p-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-sm">
              <p className="text-label-md font-bold text-primary uppercase tracking-wider mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">dns</span>
                Backend
              </p>
              {[
                { nome: 'Java 17 + Spring Boot 3', desc: 'Framework principal da API REST' },
                { nome: 'Spring Security + JWT', desc: 'Autenticação e autorização' },
                { nome: 'JPA / Hibernate', desc: 'Persistência e mapeamento ORM' },
                { nome: 'Oracle Database (SQL Developer)', desc: 'Banco de dados principal (produção)' },
                { nome: 'MySQL',                           desc: 'Banco alternativo (compatibilidade)' },
                { nome: 'Maven', desc: 'Gerenciamento de dependências' },
              ].map(({ nome, desc }) => (
                <div key={nome} className="flex items-start gap-sm p-sm bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[16px] mt-xs flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">{nome}</p>
                    <p className="text-[11px] text-on-surface-variant">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-sm">
              <p className="text-label-md font-bold text-tertiary uppercase tracking-wider mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">web</span>
                Frontend
              </p>
              {[
                { nome: 'React 18 + Vite', desc: 'Interface moderna e rápida' },
                { nome: 'Tailwind CSS', desc: 'Estilização utilitária e responsiva' },
                { nome: 'React Router DOM', desc: 'Navegação entre páginas' },
                { nome: 'Axios', desc: 'Comunicação com a API' },
                { nome: 'jsPDF + html2canvas', desc: 'Geração de PDF das notas fiscais' },
              ].map(({ nome, desc }) => (
                <div key={nome} className="flex items-start gap-sm p-sm bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-tertiary text-[16px] mt-xs flex-shrink-0">check_circle</span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">{nome}</p>
                    <p className="text-[11px] text-on-surface-variant">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desenvolvedor */}
      <div className="bg-surface border border-outline-variant/40 rounded-2xl overflow-hidden shadow-card">
        <div className="px-xl py-lg border-b border-outline-variant bg-surface-container-low flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Desenvolvedor</h2>
        </div>
        <div className="p-xl">
          <div className="flex flex-col md:flex-row items-start gap-xl">
            {/* Avatar */}
            <div className="flex-shrink-0 flex flex-col items-center gap-md">
              <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-3xl shadow-lg">
                GA
              </div>
              <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Disponível para projetos
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-md">
              <div>
                <h3 className="text-headline-md font-bold text-on-surface">Gabriel Lima</h3>
                <p className="text-body-md text-on-surface-variant mt-xs">
                  Desenvolvedor Full Stack com experiência em sistemas web modernos, APIs REST com Java/Spring Boot e interfaces com React. Apaixonado por criar soluções que resolvem problemas reais do dia a dia de empresas.
                </p>
              </div>

              {/* Contact links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                <a
                  href="mailto:ogabriellima1999@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-md p-md bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-red-600">mail</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">E-mail</p>
                    <p className="text-label-md font-semibold text-on-surface truncate">ogabriellima1999</p>
                  </div>
                </a>

                <a
                  href="https://github.com/CodeByGabrielDev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-md p-md bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-surface-container-highest rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-on-surface">code</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">GitHub</p>
                    <p className="text-label-md font-semibold text-on-surface truncate">CodeByGabrielDev</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/gabriel-lima-892682213"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-md p-md bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-blue-600">work</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">LinkedIn</p>
                    <p className="text-label-md font-semibold text-on-surface truncate">gabriel-lima-892682213</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer do sistema */}
      <div className="text-center py-lg border-t border-outline-variant">
        <p className="text-body-sm text-on-surface-variant">
          SmartPDV v1.0.0 · Desenvolvido com ❤️ por <strong className="text-primary">Gabriel Lima</strong> · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
