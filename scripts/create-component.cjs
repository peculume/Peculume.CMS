const fs = require("fs");
const path = require("path");

const componentName = process.argv[2];
if (!componentName) {
  console.error("❌ Please provide a component name.");
  process.exit(1);
}

const componentDir = path.resolve(__dirname, "../src/components", componentName);
const componentFile = path.join(componentDir, `${componentName}.tsx`);
const indexFile = path.resolve(__dirname, "../src/components/index.tsx");

if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });

  const componentCode = `const ${componentName} = () => {
  return <div>${componentName} component</div>;
};

export default ${componentName};
`;

  fs.writeFileSync(componentFile, componentCode);
  console.log(`✅ Created ${componentFile}`);
} else {
  console.error("❌ Component directory already exists.");
  process.exit(1);
}

// Step 2: Add export to index.tsx if not already present
const exportLine = `export { default as ${componentName} } from "./${componentName}/${componentName}";\n`;

if (!fs.existsSync(indexFile)) {
  fs.writeFileSync(indexFile, exportLine);
} else {
  const existing = fs.readFileSync(indexFile, "utf-8");
  if (!existing.includes(exportLine.trim())) {
    fs.appendFileSync(indexFile, exportLine);
  }
}

console.log(`✅ Updated ${indexFile}`);
