# FlashTrade Sim 📈

> **Learn, Practice, and Master Trading Without Risk**

FlashTrade Sim is a comprehensive Base MiniApp designed for aspiring traders to practice trading strategies in a simulated environment with real-time market data and advanced analytics.

![FlashTrade Sim](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### Core Trading Features
- **Real-time Market Simulation** - Live price feeds with realistic market movements
- **Advanced Order Types** - Market, Limit, Stop-Loss, and Take-Profit orders
- **Risk Management Tools** - Built-in stop-loss and take-profit functionality
- **Multiple Trading Strategies** - Scalping, Day Trading, Swing Trading, HODL, and DCA
- **Portfolio Management** - Virtual balance tracking and position management

### Analytics & Performance
- **Comprehensive Analytics** - P&L tracking, win rate, Sharpe ratio, and more
- **Performance Metrics** - Detailed trade history and performance insights
- **Visual Charts** - Interactive price charts and profit/loss visualization
- **Achievement System** - Gamified learning with trading milestones

### Learning & Education
- **Structured Learning Paths** - Curated educational content for all skill levels
- **Interactive Tutorials** - Hands-on learning modules covering trading fundamentals
- **Strategy Guides** - In-depth guides on various trading strategies
- **Progress Tracking** - Monitor your learning journey and completed modules

### Integration & Authentication
- **Farcaster Integration** - Seamless authentication via Farcaster/Neynar
- **Base Blockchain** - Built for the Base ecosystem with RPC integration
- **Data Persistence** - Local storage with export/import functionality
- **Responsive Design** - Optimized for desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Authentication**: Farcaster/Neynar API
- **Blockchain**: Base RPC, Airstack API
- **Storage**: LocalStorage with JSON export/import
- **Deployment**: Docker-ready with production configuration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-1781.git
   cd -app-development-1781
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Farcaster/Neynar API
VITE_NEYNAR_API_KEY=your_neynar_api_key_here

# Base RPC URL
VITE_BASE_RPC_URL=https://mainnet.base.org

# Airstack API
VITE_AIRSTACK_API_KEY=your_airstack_api_key_here

# Feature Flags
VITE_ENABLE_REAL_AUTH=false
VITE_DEMO_MODE=true
VITE_STARTING_BALANCE=10000
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── trading/        # Trading-specific components
│   ├── analytics/      # Analytics and charts
│   └── ...
├── context/            # React context providers
├── services/           # API and business logic
│   ├── api.js         # External API integrations
│   ├── auth.js        # Authentication service
│   └── trading.js     # Trading logic and order management
├── styles/            # CSS and styling
└── utils/             # Utility functions
```

### Key Services

#### Authentication Service (`src/services/auth.js`)
- Farcaster integration for user authentication
- User profile management and statistics
- Achievement system and progress tracking
- Data export/import functionality

#### Trading Service (`src/services/trading.js`)
- Advanced order execution (Market, Limit, Stop-Loss, Take-Profit)
- Risk management and position sizing
- Trading analytics and performance metrics
- Strategy tracking and backtesting

#### API Service (`src/services/api.js`)
- Farcaster/Neynar API integration
- Base RPC for blockchain data
- Airstack for on-chain analytics
- Local storage management

## 🎯 Usage Guide

### Getting Started

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Authenticate via Farcaster (demo mode available)
   - Your virtual balance will be initialized

2. **Start Trading**
   - Navigate to the Trading tab
   - Select an asset (BTC, ETH, BASE, SOL)
   - Choose order type and enter trade details
   - Set optional stop-loss and take-profit levels
   - Execute your trade

3. **Monitor Performance**
   - View real-time P&L in the Analytics tab
   - Track your win rate and trading statistics
   - Analyze your trading patterns and strategies

4. **Learn and Improve**
   - Access educational content in the Learn tab
   - Complete interactive tutorials
   - Earn achievements as you progress

### Advanced Features

#### Order Types
- **Market Orders**: Execute immediately at current market price
- **Limit Orders**: Execute when price reaches specified level
- **Stop-Loss Orders**: Automatically close losing positions
- **Take-Profit Orders**: Automatically close winning positions

#### Risk Management
- Set stop-loss levels to limit downside risk
- Configure take-profit targets for profit-taking
- Monitor position sizes and portfolio allocation
- Track maximum drawdown and risk metrics

#### Analytics Dashboard
- Real-time P&L tracking
- Win rate and success metrics
- Sharpe ratio and risk-adjusted returns
- Trade history with detailed breakdowns
- Performance charts and visualizations

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting and Formatting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement Changes**
   - Add components in appropriate directories
   - Update services for business logic
   - Add tests for new functionality

3. **Test Thoroughly**
   ```bash
   npm run test
   npm run build
   ```

4. **Submit Pull Request**
   - Ensure all tests pass
   - Update documentation
   - Request code review

### API Integration

#### Adding New Market Data Sources
```javascript
// src/services/api.js
export class MarketDataService {
  static async getNewDataSource(symbol) {
    // Implement new data source integration
  }
}
```

#### Extending Authentication
```javascript
// src/services/auth.js
export class AuthService {
  static async authenticateWithNewProvider() {
    // Add new authentication provider
  }
}
```

## 🚀 Deployment

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t flashtrade-sim .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 flashtrade-sim
   ```

### Production Build

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Hosting Platform**
   - Upload `dist/` folder to your hosting provider
   - Configure environment variables
   - Set up SSL certificate

### Environment-Specific Configuration

#### Development
- Demo mode enabled
- Mock data for testing
- Detailed error logging

#### Production
- Real API integrations
- Optimized performance
- Error tracking and monitoring

## 📊 API Documentation

### Farcaster/Neynar Integration

```javascript
// Get user profile
const user = await FarcasterService.getUserByFid(fid)

// Authenticate user
const auth = await FarcasterService.authenticateUser(signerUuid)
```

### Trading Operations

```javascript
// Execute advanced trade
const result = await TradingService.executeAdvancedTrade({
  symbol: 'BTC',
  side: 'buy',
  quantity: 0.1,
  orderType: 'limit',
  price: 42000,
  stopLoss: 40000,
  takeProfit: 45000,
  strategy: 'day_trading'
})
```

### Analytics and Reporting

```javascript
// Get trading analytics
const analytics = TradingService.getAnalytics(trades)
// Returns: { totalTrades, winRate, totalPnL, sharpeRatio, ... }
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### Code Standards

- Follow ESLint configuration
- Use TypeScript for type safety
- Write comprehensive tests
- Document all public APIs
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Ecosystem** - For providing the blockchain infrastructure
- **Farcaster Community** - For authentication and social features
- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/vistara-apps/-app-development-1781/wiki)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/-app-development-1781/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vistara-apps/-app-development-1781/discussions)

## 🗺️ Roadmap

### Version 1.1 (Q1 2024)
- [ ] Real-time WebSocket price feeds
- [ ] Advanced charting with technical indicators
- [ ] Social trading features
- [ ] Mobile app development

### Version 1.2 (Q2 2024)
- [ ] AI-powered trading suggestions
- [ ] Portfolio optimization tools
- [ ] Advanced backtesting engine
- [ ] Multi-language support

### Version 2.0 (Q3 2024)
- [ ] Real money trading integration
- [ ] DeFi protocol integration
- [ ] NFT trading simulation
- [ ] Advanced risk management tools

---

**Built with ❤️ for the Base ecosystem**

*FlashTrade Sim - Where trading education meets practical experience*
