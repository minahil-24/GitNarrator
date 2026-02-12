/**
 * Test script for DiagramGenerator
 */

// Mock StorageUtils since it's used in and required by AIService/others
const StorageUtils = {
    get: async () => null,
    set: async () => { },
    remove: async () => { }
};

// Mock Logger
const Logger = {
    info: console.log,
    warn: console.warn,
    error: console.error
};

// Load the file content (since we're in node/terminal environment)
const fs = require('fs');
const path = require('path');

const diagramGeneratorPath = path.join(__dirname, '..', 'services', 'analysis', 'diagram-generator.js');
const diagramGeneratorCode = fs.readFileSync(diagramGeneratorPath, 'utf8');

// In Node.js, we can use a simpler way if we wrap it or just use the class definition
// For this test, let's just extract the class definition and use it
const DiagramGenerator = (function () {
    const codeWithoutComments = diagramGeneratorCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    return eval(`(function() { ${diagramGeneratorCode}; return DiagramGenerator; })()`);
})();

async function test() {
    console.log("Starting DiagramGenerator Test...");

    const mockAnalysis = {
        repository: { name: "TestRepo", fullName: "owner/TestRepo" },
        structure: {
            tree: [
                { path: "src/main.js", type: "blob" },
                { path: "src/utils/helper.js", type: "blob" },
                { path: "README.md", type: "blob" },
                { path: "package.json", type: "blob" },
                { path: "node_modules/express/index.js", type: "blob" } // Should be ignored
            ]
        },
        technologies: {
            languages: ["JavaScript"]
        }
    };

    console.log("\nTesting Basic Mode:");
    const basicDiagram = await DiagramGenerator.generate(mockAnalysis, 'basic');
    console.log(basicDiagram);

    if (basicDiagram.includes('graph LR') && basicDiagram.includes('src_main_js')) {
        console.log("\n✅ Basic Diagram Test Passed");
    } else {
        console.log("\n❌ Basic Diagram Test Failed");
    }

    console.log("\nTesting Advanced Mode (AI Unavailable):");
    const aiDiagram = await DiagramGenerator.generate(mockAnalysis, 'advanced', { isAvailable: () => false });
    if (aiDiagram === basicDiagram) {
        console.log("✅ Advanced Fallback Test Passed");
    } else {
        console.log("❌ Advanced Fallback Test Failed");
    }
}

test().catch(console.error);
