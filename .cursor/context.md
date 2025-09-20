# 🎯 Suppathletik Project Context for AI Assistant

## 🚀 Application Purpose
Suppathletik is a **production-grade catalog synchronization platform** that maintains real-time sync between supplier APIs and BigCommerce stores, featuring AI-enhanced content generation, intelligent circuit breakers, and comprehensive monitoring.

## 🏗️ Architecture Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Flask Web UI  │    │  BigCommerce API │    │  Supplier API   │
│  (Real-time)    │◄──►│   (Products)     │◄──►│  (Catalog)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vertex AI     │    │   Firestore      │    │ Circuit Breaker │
│ (Content Gen)   │    │  (Analytics)     │    │ (Fault Tolerance)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Key Components

### **Core Application**
- `app.py`: Flask web interface with 4,178 lines of production code
- `main.py`: CLI orchestrator for batch operations
- `src/operations/sync_logic.py`: Core synchronization with diff algorithms
- `src/core/circuit_breaker.py`: **Enhanced fault tolerance system**

### **External Integrations**
- `src/clients/bc_client.py`: BigCommerce API with singleton pattern
- `src/clients/supplier_client.py`: Third-party supplier integration
- `src/clients/google_client.py`: Vertex AI and Google services
- `src/clients/firebase_client.py`: Firestore analytics and caching

### **AI & Content Generation**
- `src/agents/`: Specialized AI agents for marketing content
- `src/services/`: Business logic and classification services
- **Circuit Breaker Protected**: All AI calls respect fault tolerance

### **Infrastructure & Deployment**
- `terraform/`: Infrastructure as Code for GCP
- `scripts/`: Operational tools and security validation
- **Security**: Comprehensive credential protection and monitoring

## 🎯 Current Priorities & Context

### **1. Security & Reliability** (CRITICAL)
- ✅ **Enhanced circuit breaker**: Halts on ALL non-200-299 status codes
- ✅ **Credential security**: All secrets in Secret Manager, no exposure
- ✅ **Automated security checks**: `./scripts/security-check.sh`
- 🔄 **Ongoing monitoring**: Circuit breaker status, error rates

### **2. AI & Content Quality**
- ✅ **Agent system**: Advanced AI with quality gates
- ✅ **Cost optimization**: Configurable limits and smart caching
- ✅ **Circuit breaker protection**: Prevents AI API abuse
- 🔄 **Quality assurance**: QA gates and auto-fixing

### **3. Performance & Scalability**
- ✅ **Caching strategies**: Multi-level caching for API calls
- ✅ **Batch operations**: Efficient bulk updates
- ✅ **Resource monitoring**: Memory, CPU, API quotas
- 🔄 **Performance optimization**: Response time improvements

### **4. Development Experience**
- ✅ **Enhanced .cursorrules**: 1,017 lines of comprehensive guidelines
- ✅ **Testing framework**: pytest with comprehensive mocking
- ✅ **Documentation**: Extensive guides and examples
- 🔄 **MCP integration**: Enhanced AI assistant capabilities

## 🔧 Development Workflow (Enhanced)

### **Pre-Development**
1. **Security Check**: Run `./scripts/security-check.sh`
2. **Environment Setup**: Verify `.env` file with real credentials
3. **Circuit Breaker**: Check `/api/circuit-breaker/status`
4. **Dependencies**: Ensure virtual environment is active

### **Development Process**
1. **Feature Branch**: Create from main with descriptive name
2. **Code Standards**: Follow enhanced patterns in `.cursorrules`
3. **Circuit Breaker**: Integrate fault tolerance for external calls
4. **Testing**: Write comprehensive tests with mocking
5. **Security**: Validate no credential exposure

### **Quality Assurance**
1. **Local Testing**: `pytest -q --tb=short`
2. **Security Scan**: Automated credential detection
3. **Performance**: Check circuit breaker metrics
4. **Documentation**: Update relevant guides

### **Deployment**
1. **Security Pre-Check**: `./scripts/security-check.sh`
2. **Local Validation**: Complete test suite
3. **Cloud Deployment**: Using secure secret references
4. **Health Verification**: Circuit breaker status, API health

## 🛠️ MCP Integration Context

### **Available MCP Services**
- **Web Search**: Research and validation capabilities
- **Image Search**: Visual content discovery
- **News Search**: Current information and trends
- **Docker**: Container management and deployment
- **Content Fetching**: Web scraping and analysis
- **Obsidian**: Knowledge management and documentation

### **Use Cases for Suppathletik**
- **Research**: Product information and market trends
- **Documentation**: Enhanced guides and troubleshooting
- **Monitoring**: External service status and updates
- **Development**: Container management and deployment automation

## 🎯 AI Assistant Optimization Context

### **Project-Specific Knowledge**
- **Circuit Breaker**: Always consider fault tolerance implications
- **Security**: Every change requires security review
- **Performance**: AI operations are cost-sensitive
- **Architecture**: Follow established client/service/agent patterns
- **Testing**: Comprehensive mocking for external dependencies

### **Common Tasks**
- **Debugging**: Check logs, circuit breaker status, credential validity
- **Feature Development**: Security-first, test-driven, documented
- **Performance Optimization**: Caching, batching, circuit breaker efficiency
- **Deployment**: Automated security checks, health verification

---

**🔄 Last Updated**: September 19, 2025  
**📊 Status**: Production-ready with enhanced security and fault tolerance  
**🎯 Focus**: Security, reliability, performance, and developer experience
