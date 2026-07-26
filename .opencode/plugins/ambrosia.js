/**
 * Ambrosia plugin for OpenCode.ai
 * Injects Ambrosia bootstrap context & tool mappings into OpenCode sessions.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};
  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }
  return { frontmatter, content: body };
};

let _bootstrapCache = undefined;

export const AmbrosiaPlugin = async ({ client }) => {
  const ambrosiaSkillsDir = path.resolve(__dirname, '../../skills');

  const getBootstrapContent = () => {
    if (_bootstrapCache !== undefined) return _bootstrapCache;

    const skillPath = path.join(ambrosiaSkillsDir, 'using-ambrosia', 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      _bootstrapCache = null;
      return null;
    }

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const toolMapping = `**Tool Mapping for OpenCode:**
When Ambrosia skills request actions, substitute OpenCode equivalents:
- Invoke a skill → OpenCode's native \`skill\` tool
- Create/edit/delete files → \`apply_patch\`
- Read files → \`read\`
- Run shell commands → \`bash\`
- Search files → \`grep\`, \`glob\`
- Subagent dispatch → \`task\` tool with \`subagent_type: "general"\``;

    _bootstrapCache = `<EXTREMELY_IMPORTANT>
You have Ambrosia active.

**Below is the full content of your 'ambrosia:using-ambrosia' skill - your introduction to using skills and standing behavioral orders:**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;

    return _bootstrapCache;
  };

  return {
    config: async (config) => {
      const skillsDir = path.join(__dirname, '../../skills');
      if (!config.skills) config.skills = {};
      if (!config.skills.paths) config.skills.paths = [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
      return config;
    },

    'experimental.chat.system.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (bootstrap) {
        output.system.push(bootstrap);
      }
      return output;
    }
  };
};

export default AmbrosiaPlugin;
