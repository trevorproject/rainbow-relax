# Rainbow Relax

An open-source application designed to guide and support users in practicing the 4-7-8 breathing technique, an effective strategy for reducing anxiety and stress. The app would provide visual and auditory instructions to help synchronize breathing, creating a calming environment with soothing sounds and an intuitive interface. Additionally, it would include personalized reminders and progress tracking to encourage consistent practice. Its goal is to offer an accessible and effective tool to reassure users during moments of emotional or nervous distress.

## Installation

You must have Git and NodeJS on your terminal.

```bash
    git clone [Repository-Link]
    cd Breathing-exercise
```

To install dependencies:

```bash
    npm install
```

To run project in development enviroment:

```bash
    npm run dev
```

# How to Test Deployment

### 1. Testing for DEV 
To test the deployment for **DEV**, follow these steps:

1. **Push to the `main` branch:**
   - Make sure your changes are committed to the `main` branch.
   - Run the following command to push the changes:
     ```bash
     git push origin main
     ```
2. The link for this test is : https://trevorproject.github.io/rainbow-relax/dev/

3. **Verify Deployment:**
   - The **DEV deployment** will automatically trigger upon any push to `main`.
   - You can check the deployment status on GitHub Actions under **Actions > Deploy to DEV**.
   - Once deployed, visit the GitHub Pages URL to verify that the changes are reflected.

---

### 2. Testing for QA
To test the deployment for **QA**, follow these steps:

1. **Create a QA Tag:**
   - You need to create a tag with the `qa-` prefix.
   - Run the following command to create and push the tag:
     ```bash
     git tag qa-v1.0
     git push origin qa-v1.0
     ```

2. The link for this test is : https://trevorproject.github.io/rainbow-relax/qa/

3. **Verify Deployment:**
   - The **QA deployment** will trigger automatically when the tag is pushed.
   - You can check the deployment status on GitHub Actions under **Actions > Deploy to QA**.
   - Once deployed, visit the GitHub Pages URL and confirm the changes are live for QA.

---

### 3. Testing for PROD 
To test the deployment for **PROD**, follow these steps:

1. **Create a PROD Tag:**
   - You need to create a tag with the `prod-` prefix.
   - Run the following command to create and push the tag:
     ```bash
     git tag prod-v1.0
     git push origin prod-v1.0
     ```
2. The link for this test is : https://trevorproject.github.io/rainbow-relax/prod/

3. **Verify Deployment:**
   - The **PROD deployment** will trigger automatically when the tag is pushed.
   - You can check the deployment status on GitHub Actions under **Actions > Deploy to PROD**.
   - Once deployed, visit the GitHub Pages URL and confirm the changes are live for production.

---
# Audio Credits

### Voice Generation
The voice instructions in this application were generated using **ElevenLabs** AI voice synthesis technology.

- **Voice Model Used**: Nathaniel C - Suspense,British calm
- **Platform**: [ElevenLabs](https://elevenlabs.io/)
- **Usage**: Voice instructions for breathing exercises and guided meditation

*All voice content was generated specifically for this open-source project to provide accessible breathing exercise guidance.*

## Authors

- [The Trevor Project] https://www.thetrevorproject.org/

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
