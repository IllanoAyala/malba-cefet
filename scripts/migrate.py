import os
import glob
import json

GLOBAL_WORKFLOW_DIRS = [
    os.path.expanduser("~/.gemini/config/global_workflows"),
    os.path.expanduser("~/.gemini/config/workflows")
]
GLOBAL_MANIFEST = os.path.expanduser("~/.gemini/config/workflows.json")
GLOBAL_SKILLS_DIR = os.path.expanduser("~/.gemini/config/skills")

WORKSPACE_ROOT = "/home/illano-ayala/Desktop/FACULDADE/BCE/PROJETO"
WORKSPACE_WORKFLOW_DIRS = [
    os.path.join(WORKSPACE_ROOT, ".agents/workflows"),
    os.path.join(WORKSPACE_ROOT, "_agents/workflows"),
    os.path.join(WORKSPACE_ROOT, ".agent/workflows"),
    os.path.join(WORKSPACE_ROOT, "_agent/workflows")
]
WORKSPACE_MANIFESTS = [
    os.path.join(WORKSPACE_ROOT, ".agents/workflows.json"),
    os.path.join(WORKSPACE_ROOT, "_agents/workflows.json"),
    os.path.join(WORKSPACE_ROOT, ".agent/workflows.json"),
    os.path.join(WORKSPACE_ROOT, "_agent/workflows.json")
]

def process_workflow(workflow_path, target_skills_dir):
    name = os.path.basename(workflow_path).replace('.md', '')
    target_skill_dir = os.path.join(target_skills_dir, name)
    target_skill_path = os.path.join(target_skill_dir, "SKILL.md")
    
    if os.path.exists(target_skill_path):
        os.rename(workflow_path, workflow_path + ".bak")
        return name, workflow_path, target_skill_path, "Already Migrated"
        
    with open(workflow_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    lines = content.split('\n')
    frontmatter = {}
    body = content
    if lines and lines[0].strip() == '---':
        try:
            end_idx = lines.index('---', 1)
            for line in lines[1:end_idx]:
                if ':' in line:
                    k, v = line.split(':', 1)
                    frontmatter[k.strip()] = v.strip()
            body = '\n'.join(lines[end_idx+1:])
        except ValueError:
            pass
            
    new_name = frontmatter.get('name', name)
    
    # Try to extract description from first heading or paragraph if not in frontmatter
    new_desc = frontmatter.get('description', f"Migrated workflow for {name}")
    
    new_content = f"---\nname: {new_name}\ndescription: {new_desc}\n---\n{body}"
    
    os.makedirs(target_skill_dir, exist_ok=True)
    with open(target_skill_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    os.rename(workflow_path, workflow_path + ".bak")
    return name, workflow_path, target_skill_path, "Migrated"

results = []

for d in GLOBAL_WORKFLOW_DIRS:
    if os.path.exists(d):
        for f in glob.glob(os.path.join(d, "*.md")):
            res = process_workflow(f, GLOBAL_SKILLS_DIR)
            results.append(("Global", *res))

for d in WORKSPACE_WORKFLOW_DIRS:
    if os.path.exists(d):
        base_dir = os.path.dirname(d)
        target_skills_dir = os.path.join(base_dir, "skills")
        for f in glob.glob(os.path.join(d, "*.md")):
            res = process_workflow(f, target_skills_dir)
            results.append(("Workspace", *res))

for m in [GLOBAL_MANIFEST] + WORKSPACE_MANIFESTS:
    if os.path.exists(m):
        os.rename(m, m + ".bak")

print("| Scope | Workflow Name | Source Path | Target Skill Path | Status |")
print("| :--- | :--- | :--- | :--- | :--- |")
for scope, name, src, tgt, status in results:
    print(f"| {scope} | `{name}` | `{src}` | `{tgt}` | `{status}` |")

