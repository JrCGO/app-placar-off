# 🏆 App Placar PWA

Um aplicativo PWA (Progressive Web App) para marcar placares de jogos entre dois times. Funciona 100% offline e é compatível com Android e iOS.

## ✨ Características

- **Funciona Offline**: Não precisa de internet para funcionar
- **PWA Completo**: Pode ser instalado como app nativo
- **Interface Intuitiva**: Design moderno em modo horizontal
- **Persistência Local**: Salva automaticamente os dados
- **Layout Elegante**: Scoreboard ocupa 100% da tela
- **Compatível**: Android, iOS e navegadores desktop

## 🚀 Como Usar

### Acesso Online
- **Demo**: [Acesse o app online](https://app-placar.vercel.app)
- **Instalação**: Adicione à tela inicial para usar como app nativo

### Instalação no Celular

1. Abra o app no navegador do seu celular
2. Procure por "Adicionar à tela inicial" ou "Instalar app"
3. Confirme a instalação
4. O app aparecerá na tela inicial como um aplicativo nativo

### Funcionalidades

#### Placar Principal
- **Somar Pontos**: Toque no botão "+" para cada time
- **Diminuir Pontos**: Toque no botão "-" para cada time
- **Editar Nomes**: Toque diretamente nos campos de texto dos times

#### Controles
- **Resetar Placar**: Toque no botão "Resetar" no meio da tela

### Atalhos de Teclado (Desktop)

- **1**: Aumenta pontuação do Time 1
- **2**: Aumenta pontuação do Time 2
- **Q**: Diminui pontuação do Time 1
- **W**: Diminui pontuação do Time 2
- **Ctrl+R**: Resetar placar

### Gestos Touch (Mobile)

- **Swipe para direita**: Aumenta pontuação do Time 1
- **Swipe para esquerda**: Aumenta pontuação do Time 2

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e animações
- **JavaScript**: Funcionalidades interativas
- **Service Worker**: Funcionamento offline
- **Web App Manifest**: Instalação como PWA
- **LocalStorage**: Persistência de dados

## 📱 Compatibilidade

- ✅ Android (Chrome, Samsung Internet, Firefox)
- ✅ iOS (Safari, Chrome)
- ✅ Windows (Edge, Chrome, Firefox)
- ✅ macOS (Safari, Chrome, Firefox)
- ✅ Linux (Chrome, Firefox)

## 🎯 Funcionalidades Offline

- O app funciona completamente sem internet
- Todos os dados são salvos localmente
- Service Worker cache todos os recursos necessários
- Atualizações automáticas quando voltar online

## 🎨 Personalização

O app possui:
- Tema responsivo que se adapta ao dispositivo
- Suporte a modo escuro (se habilitado no sistema)
- Animações suaves e feedback visual
- Som de feedback para mudanças de placar

## 📊 Dados Salvos

O app salva localmente:
- Estado atual do jogo (nomes e placares)
- Histórico dos últimos 10 jogos
- Configurações de preferências

## 🔄 Atualizações

O app se atualiza automaticamente quando:
- Você volta online após ficar offline
- Há uma nova versão disponível
- O cache é limpo

## 🛠️ Desenvolvimento

### Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/app-placar.git
cd app-placar
```

2. Sirva os arquivos através de um servidor HTTP:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js (npx)
npx serve .

# Usando Live Server (VS Code)
# Instale a extensão Live Server e clique com botão direito no index.html
```

3. Acesse `http://localhost:8000` no navegador

### Arquivos Principais
- `index.html` - Interface principal
- `styles.css` - Estilos e layout
- `app.js` - Lógica do aplicativo
- `sw.js` - Service Worker para offline
- `manifest.json` - Configuração do PWA
- `icon.svg` - Ícone do aplicativo

### Deploy

O projeto está configurado para deploy automático no Vercel:

1. **GitHub**: Push para a branch `main` faz deploy automático
2. **Vercel**: [https://vercel.com](https://vercel.com)
3. **URL**: https://app-placar.vercel.app

## 📝 Licença

Este projeto é de código aberto e pode ser usado livremente.

## 🎉 Uso Recomendado

Perfeito para:
- Jogos de futebol, basquete, vôlei
- Competições escolares
- Torneios familiares
- Qualquer jogo que precise de placar

---

**Desenvolvido com ❤️ para funcionar offline e ser simples de usar!**
