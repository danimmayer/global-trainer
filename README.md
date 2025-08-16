# Global Trainer - Portal de Cursos Online

Uma plataforma moderna de cursos online desenvolvida com React, TypeScript, Supabase e integração completa de pagamentos.

## 🚀 Funcionalidades

- **Autenticação completa** com Supabase Auth
- **Catálogo de cursos** com filtros e busca
- **Sistema de pagamentos** integrado com Mercado Pago (PIX, Cartão, Boleto)
- **Notificações por email** com templates responsivos via Resend
- **Área do aluno** com dashboard e progresso
- **Gestão de pedidos** e matrículas
- **Design responsivo** com Tailwind CSS

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Banco de dados**: Supabase (PostgreSQL)
- **Pagamentos**: Mercado Pago SDK
- **Email**: Resend
- **Hospedagem**: Vercel

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/danimmayer/global-trainer.git
cd global-trainer
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute as migrações em `supabase/migrations/`
   - Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

5. Configure o Mercado Pago:
   - Crie uma conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
   - Configure as variáveis `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_PUBLIC_KEY`

6. Configure o Resend:
   - Crie uma conta no [Resend](https://resend.com)
   - Configure a variável `RESEND_API_KEY`

## 🚀 Execução

### Desenvolvimento

```bash
# Frontend
npm run dev

# Backend (em outro terminal)
npm run api:dev
```

### Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
├── api/                    # Backend Express
│   ├── routes/            # Rotas da API
│   └── index.ts           # Servidor principal
├── shared/                # Código compartilhado
│   ├── lib/              # Configurações
│   ├── services/         # Serviços (email, pagamento)
│   └── types/            # Tipos TypeScript
├── src/                   # Frontend React
│   ├── components/       # Componentes reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   └── services/         # Serviços do frontend
├── supabase/             # Migrações do banco
└── .trae/documents/      # Documentação técnica
```

## 🔄 Fluxo de Pagamento

1. **Seleção do curso** - Usuário escolhe um curso
2. **Checkout** - Preenchimento dos dados e escolha do método de pagamento
3. **Processamento** - Integração com Mercado Pago
4. **Confirmação** - Webhook processa o pagamento
5. **Acesso liberado** - Usuário é matriculado automaticamente
6. **Notificação** - Email de confirmação enviado

## 📧 Templates de Email

- **Confirmação de pedido** - Enviado imediatamente após a compra
- **Instruções PIX** - Para pagamentos via PIX
- **Confirmação de pagamento** - Quando o pagamento é aprovado

## 🔐 Segurança

- Autenticação JWT via Supabase
- Validação de webhooks do Mercado Pago
- Sanitização de dados de entrada
- Rate limiting nas APIs
- Compliance com LGPD

## 📊 Monitoramento

- Logs estruturados
- Métricas de conversão
- Tracking de eventos
- Alertas de erro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@globaltrainer.com.br

---

**Global Trainer** - Transformando conhecimento em oportunidades 🚀