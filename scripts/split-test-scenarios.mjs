import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'docs/test/TEST-SCENARIOS.part-01.md',
  'docs/test/TEST-SCENARIOS.part-02.md'
];
const outputBaseDir = 'docs/test/scenarios';
const NL = '
';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function processScenarios() {
  for (const filePath of filesToProcess) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(NL);
    
    let currentScenario = null;
    let currentContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('### TC-')) {
        if (currentScenario) {
          const idMatch = currentScenario.match(/TC-([A-Z]+)-\d+/);
          if (idMatch) {
            const area = idMatch[1];
            const idFull = currentScenario.match(/TC-[A-Z]+-\d+/)[0];
            const areaDir = path.join(outputBaseDir, area);
            ensureDir(areaDir);
            fs.writeFileSync(path.join(areaDir, `${idFull}.md`), `${currentScenario}${NL}${NL}${currentContent.join(NL).trim()}`);
          }
        }
        currentScenario = line;
        currentContent = [];
        continue;
      }
      
      if (line.startsWith('## ')) {
        if (currentScenario) {
          const idMatch = currentScenario.match(/TC-([A-Z]+)-\d+/);
          if (idMatch) {
            const area = idMatch[1];
            const idFull = currentScenario.match(/TC-[A-Z]+-\d+/)[0];
            const areaDir = path.join(outputBaseDir, area);
            ensureDir(areaDir);
            fs.writeFileSync(path.join(areaDir, `${idFull}.md`), `${currentScenario}${NL}${NL}${currentContent.join(NL).trim()}`);
          }
          currentScenario = null;
          currentContent = [];
        }
        continue;
      }
      
      if (currentScenario) {
        currentContent.push(line);
      }
    }
    
    if (currentScenario) {
      const idMatch = currentScenario.match(/TC-([A-Z]+)-\d+/);
      if (idMatch) {
        const area = idMatch[1];
        const idFull = currentScenario.match(/TC-[A-Z]+-\d+/)[0];
        const areaDir = path.join(outputBaseDir, area);
        ensureDir(areaDir);
        fs.writeFileSync(path.join(areaDir, `${idFull}.md`), `${currentScenario}${NL}${NL}${currentContent.join(NL).trim()}`);
      }
    }

    if (filePath.includes('part-02.md')) {
      const regLines = [];
      let inRegMatrix = false;
      for (const line of lines) {
        if (line.includes('## 16. Regression & edge-case matrix')) {
          inRegMatrix = true;
          continue;
        }
        if (inRegMatrix && line.startsWith('## ')) {
          break;
        }
        if (inRegMatrix) {
          regLines.push(line);
        }
      }
      
      const regDir = path.join(outputBaseDir, 'REGRESSION');
      ensureDir(regDir);
      
      for (const line of regLines) {
        if (line.startsWith('|') && !line.includes('---') && !line.includes('# | Scenario')) {
          const cols = line.split('|').filter(c => c.trim() !== '');
          if (cols.length >= 3) {
            const id = cols[0].trim();
            const scenario = cols[1].trim();
            const expected = cols[2].trim();
            fs.writeFileSync(path.join(regDir, `${id}.md`), `# Regression Scenario ${id}: ${scenario}${NL}${NL}**Expected Result:** ${expected}`);
          }
        }
      }
    }
  }
}

processScenarios().catch(console.error);
