# Sistema de Gestão de Veículos Salvados

Sistema web para gestão de veículos salvados (indenizados) da Administradora Mutual.

## Descrição

O sistema permite:
- Importação de planilhas de leilão (Excel)
- Cadastro manual de veículos
- Integração com API FIPE para valores de referência
- Importação automática do Google Sheets
- Análise de aprovação com KPIs
- Relatórios de performance
- Sistema de notificações
- Exportação de relatórios em PDF/Excel

## Tecnologias

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS
- **Roteamento:** Wouter
- **UI Components:** Radix UI
- **Gráficos:** Chart.js
- **Exportação:** jsPDF + xlsx

## Estrutura do Projeto

```
salvados-site/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── contexts/       # Contextos React
│   ├── lib/            # Utilitários e helpers
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── server/             # Serviços backend (opcional)
├── db/                 # Schemas do banco de dados
└── public/             # Arquivos estáticos
```

## Funcionalidades

### 1. Dashboard
- Visão geral dos veículos no pátio
- Métricas de performance
- Alertas e notificações

### 2. Importação de Leilão
- Upload de planilhas Excel
- Parsing automático de dados
- Validação e cálculo de valores

### 3. Cadastro Manual
- Formulário de cadastro de veículos
- Busca automática de valor FIPE
- Validação de campos

### 4. Importação Google Sheets
- Integração com Google Sheets API
- Extração de múltiplas abas
- Sincronização automática

### 5. Relatórios
- Análise de desvio por tipo de veículo
- Histórico de leilões
- Exportação em PDF/Excel

## Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Deploy

O projeto está configurado para deploy na Vercel:

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente (se necessário)
3. Deploy automático a cada push

## URL de Produção

https://salvados.administradoramutual.com.br

## Documentação

Para documentação completa, acesse:
https://docs.administradoramutual.com.br/sistemas-internos/sistema-salvados

## Licença

MIT
