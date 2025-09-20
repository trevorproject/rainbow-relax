# 🎯 Enhanced Cursor AI Rules for Suppathletik

## 🚀 Project Context
Suppathletik is a **production-grade catalog synchronization platform** with advanced security, fault tolerance, and AI integration.

### **Technology Stack**
- **Backend**: Python 3.11, Flask web framework (4,178 lines)
- **APIs**: BigCommerce, Supplier, Google Vertex AI
- **Data**: Firebase/Firestore for analytics and caching
- **Infrastructure**: Google Cloud Run, Secret Manager, Terraform
- **Security**: Enhanced circuit breakers, credential protection
- **AI**: Vertex AI with quality gates and cost optimization

## 🔒 Security-First Development Rules

### **CRITICAL SECURITY REQUIREMENTS**
1. **Never expose credentials** - Use placeholder values in all examples
2. **Always run security checks** - `./scripts/security-check.sh` before commits
3. **Use .env files locally** - Never commit sensitive data
4. **Secret Manager for production** - All credentials via GCP Secret Manager
5. **Validate all inputs** - Sanitize and validate user data
6. **Log securely** - Never log credentials or sensitive information

### **Security Validation Commands**
```bash
# Pre-commit security check
./scripts/security-check.sh

# Credential exposure scan
grep -r "AIza|sk-|xoxb-|ya29" . --exclude-dir=.git --exclude-dir=.venv

# Environment validation
[ -f ".env" ] && echo "✅ .env exists" || echo "❌ .env missing"
```

## 🛡️ Circuit Breaker Integration (MANDATORY)

### **Enhanced Circuit Breaker Rules**
- **ALL non-200-299 status codes** trigger circuit breaker
- **Fast fail on 4xx errors** (auth/client errors) after 2 attempts
- **Smart retry on 5xx errors** with exponential backoff
- **Configurable thresholds** via environment variables
- **Monitoring endpoints** for status and manual reset

### **Circuit Breaker Code Patterns**
```python
# ✅ ALWAYS check circuit breaker before expensive operations
from src.core.circuit_breaker import gemini_circuit_breaker

def ai_operation():
    if not gemini_circuit_breaker.can_execute():
        logger.warning("Operation skipped - circuit breaker OPEN")
        return None
    
    try:
        result = expensive_api_call()
        gemini_circuit_breaker.record_success()
        return result
    except requests.HTTPError as e:
        gemini_circuit_breaker.record_failure(
            status_code=e.response.status_code
        )
        raise
```

### **Circuit Breaker Management**
```bash
# Check status
curl -H "Authorization: Basic $(echo -n 'admin@admin.com:admin' | base64)" \
  "https://supp-athletik-260933347684.us-central1.run.app/api/circuit-breaker/status"

# Force reset if stuck
curl -X POST -H "Authorization: Basic $(echo -n 'admin@admin.com:admin' | base64)" \
  "https://supp-athletik-260933347684.us-central1.run.app/api/circuit-breaker/reset"
```

## 🧠 AI-Enhanced Code Generation

### **Advanced Prompting Guidelines**
1. **Be specific**: "Add circuit breaker to BigCommerce client with 2-failure threshold"
2. **Provide context**: Include error messages, logs, current code
3. **Request security review**: Always ask for security implications
4. **Include tests**: Request unit tests for new functionality
5. **Document thoroughly**: Ask for inline comments and examples

### **Code Quality Requirements**
```python
# ✅ GOOD: Production-grade function with all requirements
from typing import Dict, List, Optional
from src.core.circuit_breaker import gemini_circuit_breaker

def sync_products(products: List[Dict], dry_run: bool = False) -> SyncResult:
    \"\"\"Synchronize products with circuit breaker protection.
    
    Args:
        products: List of product dictionaries
        dry_run: If True, validate only without making changes
        
    Returns:
        SyncResult with counts and status
        
    Raises:
        ValidationError: If product data is invalid
        CircuitBreakerError: If circuit breaker is open
    \"\"\"
    if not gemini_circuit_breaker.can_execute():
        raise CircuitBreakerError("Sync halted - circuit breaker OPEN")
    
    try:
        # Implementation here
        result = _perform_sync(products, dry_run)
        gemini_circuit_breaker.record_success()
        return result
    except Exception as e:
        gemini_circuit_breaker.record_failure()
        logger.error(f"Sync failed: {e}", extra={"product_count": len(products)})
        raise
```

## 🔧 Architecture Patterns (Enhanced)

### **Client Pattern** (API Integration)
- **Singleton usage**: `BigCommerceClient.get_instance()`
- **Circuit breaker integration**: All external calls protected
- **Comprehensive error handling**: Status code awareness
- **Security**: Never log credentials or sensitive data
- **Testing**: Mock entire clients, not individual methods

### **Service Pattern** (Business Logic)
- **Stateless design**: Pure functions preferred
- **Dependency injection**: Accept clients as parameters
- **Error propagation**: Let exceptions bubble with context
- **Performance monitoring**: Track timing and success rates

### **Agent Pattern** (AI Components)
- **Circuit breaker aware**: Check state before AI calls
- **Cost optimization**: Track token usage and costs
- **Quality gates**: Use QA validation and auto-fixing
- **Fallback strategies**: Graceful degradation when AI unavailable

## 🧪 Testing Excellence

### **Testing Strategy**
```python
# ✅ Comprehensive test with circuit breaker mocking
import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def mock_circuit_breaker():
    with patch('src.core.circuit_breaker.gemini_circuit_breaker') as mock:
        mock.can_execute.return_value = True
        mock.is_open.return_value = False
        yield mock

def test_sync_with_circuit_breaker_open(mock_circuit_breaker):
    mock_circuit_breaker.can_execute.return_value = False
    
    result = sync_products([{"sku": "TEST"}])
    
    assert result.skipped is True
    assert result.reason == "circuit_breaker_open"
```

### **Test Requirements**
- **Mock all external APIs**: BigCommerce, Vertex AI, Supplier
- **Test circuit breaker scenarios**: OPEN, CLOSED, HALF_OPEN states
- **Security testing**: Validate credential protection
- **Performance testing**: Response time and resource usage
- **Error scenarios**: Test all failure modes

## 📊 Performance & Monitoring

### **Key Metrics to Track**
- Circuit breaker state and failure counts
- API response times and success rates
- AI token usage and estimated costs
- Memory and CPU utilization
- Error rates by type and endpoint

### **Monitoring Commands**
```bash
# Circuit breaker status
curl -s -H "Authorization: Basic $(echo -n 'admin@admin.com:admin' | base64)" \
  "https://supp-athletik-260933347684.us-central1.run.app/api/circuit-breaker/status"

# Recent errors
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=supp-athletik AND severity>=ERROR" --limit=10

# Performance metrics
curl -s "https://supp-athletik-260933347684.us-central1.run.app/health"
```

## 🚨 Emergency Procedures

### **Circuit Breaker Issues**
```bash
# If circuit breaker stuck OPEN
curl -X POST -H "Authorization: Basic $(echo -n 'admin@admin.com:admin' | base64)" \
  "https://supp-athletik-260933347684.us-central1.run.app/api/circuit-breaker/reset"
```

### **Security Incidents**
```bash
# Emergency credential scan
./scripts/security-check.sh

# Emergency credential rotation
echo -n "new_credential" | gcloud secrets versions add secret-name --data-file=-
```

### **Deployment Rollback**
```bash
# Emergency rollback
gcloud run services update-traffic supp-athletik --to-revisions=PREVIOUS=100 --region=us-central1
```

---

**🏆 ENHANCED RULES ACTIVE**  
**📊 Stats**: 1,017 lines in .cursorrules, 34 security sections, 90 circuit breaker mentions  
**🎯 Focus**: Security-first development with comprehensive fault tolerance
