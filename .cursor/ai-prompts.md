# 🧠 AI Assistant Prompts for Rainbow Relax

## 🎯 Context-Aware Prompting

### **Project-Specific Context Prompts**
Use these prompts to provide rich context to the AI assistant:

```
I'm working on Rainbow Relax, a breathing exercise app with:
- React + TypeScript + Vite architecture
- Custom navigation system (no react-router-dom)
- Dual-mode support (standalone app + embeddable widget)
- Tailwind CSS with rr- prefix for isolation
- Audio integration with Howler.js
- Internationalization (i18n) support
- Playwright E2E testing

Current focus: [describe your current task]
```

### **Navigation System Prompts**
```
When working with navigation in Rainbow Relax, please:
1. Use the custom NavigationContext (not react-router-dom)
2. Remember that navigation state includes exerciseState
3. Pass minutes and exerciseType when navigating to breathing exercise
4. Use RoutesEnum constants for route names
5. Consider widget vs standalone app differences
6. Handle navigation state properly in components
```

### **Widget Development Prompts**
```
For widget-specific features, please:
1. Check for window.myWidgetConfig to detect widget mode
2. Use conditional rendering for widget vs standalone differences
3. Consider CSS isolation with rr- prefix
4. Handle external asset loading for widget mode
5. Implement proper container mounting
6. Ensure no conflicts with host page
```

## 🔧 Development Task Prompts

### **Feature Development**
```
I need to implement [feature description] for Rainbow Relax. Please:
1. Follow the existing component patterns
2. Use the NavigationContext for state management
3. Add proper TypeScript types
4. Consider both widget and standalone modes
5. Include proper error handling
6. Write E2E tests with Playwright
7. Update translations if needed

Current architecture context: [relevant components]
```

### **Navigation & State Management**
```
I'm working on navigation in Rainbow Relax:
- Current issue: [description]
- Component: [affected component]
- Navigation context: [current state]
- Widget mode: [yes/no]

Please help me:
1. Fix the navigation issue
2. Ensure proper state management
3. Handle exercise state correctly
4. Test both widget and standalone modes
5. Consider performance implications
```

### **Component Development**
```
I need to create/update a component for Rainbow Relax:
- Component type: [UI/Logic/Context]
- Widget compatibility: [required/not needed]
- Styling approach: [Tailwind with rr- prefix/inline styles]
- State requirements: [local/navigation/audio]

Please provide:
1. Component structure following existing patterns
2. Proper TypeScript interfaces
3. Widget compatibility considerations
4. Styling implementation
5. Integration with navigation system
```

## 🎨 Styling & UI Prompts

### **CSS & Styling**
```
When styling components in Rainbow Relax:
1. Use rr- prefix for Tailwind classes to avoid conflicts
2. Consider inline styles for widget mode isolation
3. Use CSS custom properties for theming
4. Ensure responsive design
5. Maintain accessibility standards
6. Test in both widget and standalone modes

Current styling context: [component/styling issue]
```

### **Widget Styling Isolation**
```
For widget styling, please:
1. Use inline styles when rr- prefix isn't sufficient
2. Avoid global CSS that could conflict
3. Consider Shadow DOM implications
4. Test styling in widget container
5. Ensure proper responsive behavior
6. Maintain visual consistency
```

## 🧪 Testing Prompts

### **E2E Test Development**
```
I need to write/update E2E tests for Rainbow Relax:
- Component: [what to test]
- Widget mode: [yes/no]
- Navigation flow: [specific paths]
- Browser compatibility: [requirements]

Please create:
1. Playwright test following existing patterns
2. Proper selectors for widget vs standalone
3. Navigation flow testing
4. Error scenario coverage
5. Cross-browser compatibility
```

### **Test Debugging**
```
I'm debugging a failing test in Rainbow Relax:
- Test: [test name]
- Error: [exact error message]
- Component: [affected component]
- Widget mode: [yes/no]

Please help me:
1. Analyze the test failure
2. Check selector issues
3. Verify navigation flow
4. Fix timing issues
5. Update test expectations
```

## 🔧 Build & Development Prompts

### **Build Configuration**
```
I need to update build configuration for Rainbow Relax:
- Target: [main app/widget/both]
- Asset handling: [bundling/external loading]
- Bundle size: [optimization requirements]
- Environment: [development/production]

Please help with:
1. Vite configuration updates
2. Asset optimization
3. Bundle size reduction
4. Widget-specific builds
5. Development workflow improvements
```

### **Performance Optimization**
```
I need to optimize performance for Rainbow Relax:
- Current metrics: [bundle size, load time, etc.]
- Bottleneck: [suspected issue area]
- Widget requirements: [size constraints]
- Audio loading: [performance considerations]

Please suggest:
1. Bundle optimization strategies
2. Asset loading improvements
3. Component lazy loading
4. Audio optimization
5. Widget performance enhancements
```

## 🎵 Audio & Media Prompts

### **Audio Integration**
```
When working with audio in Rainbow Relax:
1. Use the AudioContext for state management
2. Consider Howler.js integration patterns
3. Handle audio loading for widget mode
4. Implement proper error handling
5. Consider performance implications
6. Test audio in different browsers

Current audio context: [component/feature]
```

### **Media Asset Management**
```
For media assets in Rainbow Relax:
1. Consider external loading for widget mode
2. Optimize asset sizes for performance
3. Handle loading states properly
4. Implement fallbacks for failed loads
5. Consider CDN integration
6. Test asset loading in widget container
```

## 🌐 Internationalization Prompts

### **i18n Development**
```
I need to work with translations in Rainbow Relax:
- Component: [what needs translation]
- Language: [en/es]
- Context: [usage context]

Please help with:
1. Adding new translation keys
2. Using existing translation patterns
3. Testing different languages
4. Handling missing translations
5. Updating translation files
```

## 🚀 Deployment & Release Prompts

### **Widget Release**
```
I need to prepare a widget release for Rainbow Relax:
- Changes made: [description]
- Version: [version number]
- Testing status: [test results]
- Bundle size: [current size]

Please guide me through:
1. Build process verification
2. Widget testing procedures
3. Asset optimization
4. Release documentation
5. CDN deployment steps
```

### **Main App Deployment**
```
I need to deploy the main Rainbow Relax app:
- Changes: [description]
- Environment: [staging/production]
- Testing: [completed tests]

Please help with:
1. Build verification
2. Asset optimization
3. Deployment commands
4. Post-deployment testing
5. Performance monitoring
```

## 🎯 AI Assistant Optimization

### **Context Enhancement**
```
To help you understand my current task better:
- Working on: [specific component/feature]
- Goal: [what I'm trying to achieve]
- Mode: [widget/standalone/both]
- Recent changes: [what was modified recently]
- Testing status: [current test state]
- Performance considerations: [any performance requirements]
```

### **Learning & Improvement**
```
Based on our previous interactions, please:
1. Remember the navigation system patterns
2. Consider widget vs standalone differences
3. Maintain performance optimization focus
4. Follow existing component patterns
5. Include proper error handling
6. Consider accessibility requirements
7. Test thoroughly with Playwright
```

---

**🎯 Usage Tips**:
- **Be specific** about widget vs standalone requirements
- **Include navigation context** when relevant
- **Consider performance** implications
- **Test thoroughly** with E2E tests
- **Maintain consistency** with existing patterns
- **Handle errors gracefully**
- **Consider accessibility** in all implementations

**📚 Reference**: See the component structure and navigation system for patterns
