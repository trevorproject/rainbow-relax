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

# Embedding Options

When embedding the Rainbow Relax application in another site (e.g., via an `<iframe>`), you can control specific behaviors via URL parameters.

## `showquickescape` (optional)

- **Type:** `boolean` (`true` or `false`)
- **Default:** `false`
- **Description:** Controls whether the Quick Escape instructions are visible when the app is embedded.

### Example

```html
<iframe src="https://trevorproject.github.io/rainbow-relax/dev/?showquickescape=true" width="100%" height="600"></iframe>
```

# Deployment

This project uses Firebase Hosting with three environments:

| Environment     | Site Name          | URL                              | Trigger               |
| --------------- | ------------------ | -------------------------------- | --------------------- |
| **Development** | `rainbowrelax-dev` | https://rainbowrelax-dev.web.app | Push to `main` branch |
| **QA**          | `rainbowrelax-qa`  | https://rainbowrelax-qa.web.app  | Push tag `qa-*`       |
| **Production**  | `rainbowrelax`     | https://rainbowrelax.web.app     | Push tag `prod-*`     |

---

### 1. Development (DEV)
Deploys automatically when pushing to the `main` branch.

**Steps:**
1. Commit your changes to the `main` branch
2. Push to trigger deployment:
   ```bash
   git push origin main
   ```
3. View deployment: https://rainbowrelax-dev.web.app
4. Monitor status: **Actions > Deploy to Firebase DEV**

---

### 2. Quality Assurance (QA)
Deploys when pushing a tag with the `qa-` prefix.

**Steps:**
1. Create and push a QA tag:
   ```bash
   git tag qa-0.4.14
   git push origin qa-0.4.14
   ```
2. View deployment: https://rainbowrelax-qa.web.app
3. Monitor status: **Actions > Deploy to Firebase QA**

---

### 3. Production (PROD)
Deploys when pushing a tag with the `prod-` prefix.

**Steps:**
1. Create and push a production tag:
   ```bash
   git tag prod-v1.0
   git push origin prod-v1.0
   ```
2. View deployment: https://rainbowrelax.web.app
3. Monitor status: **Actions > Deploy to Firebase PROD**

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
