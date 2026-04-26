const fs = require('fs');
const files = ['stores/chatStore.ts', 'stores/teamStore.ts', 'stores/agentStore.ts'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('authFetch')) {
      content = "import { authFetch } from '../lib/api-client';\n" + content;
      content = content.replace(/fetch\(/g, 'authFetch(');
      // Wait, there might be window.fetch? No, it just used fetch(
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
