const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express();
const upload = multer({ dest: os.tmpdir() });

// Serve static files (e.g., index.html)
app.use(express.static(__dirname));

// Serve index.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/combine', upload.array('files'), async (req, res) => {
    try {
        const { excludeFiles, ignoreFolders, ignoreExtensions, outputFile, filePaths } = req.body;
        const excludeList = excludeFiles ? JSON.parse(excludeFiles) : [];
        const ignoreFolderList = ignoreFolders ? JSON.parse(ignoreFolders) : [];
        const ignoreExtensionList = ignoreExtensions ? JSON.parse(ignoreExtensions).map(ext => ext.toLowerCase()) : [];
        const filePathsList = filePaths ? JSON.parse(filePaths) : [];
        const outputFileName = outputFile || 'combined_output.txt';
        const output = [];
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'combine-'));

        // Always ignore node_modules
        const defaultIgnoreFolders = ['node_modules'];
        const allIgnoreFolders = [...new Set([...defaultIgnoreFolders, ...ignoreFolderList])].map(f => f.toLowerCase());

        // Log number of files received
        console.log(`Number of files: ${req.files.length}`);
        console.log(`Number of file paths: ${filePathsList.length}`);

        // Validate lengths match
        if (req.files.length !== filePathsList.length) {
            throw new Error(`Mismatch: ${req.files.length} files but ${filePathsList.length} paths`);
        }

        // Map originalname to full relative path
        const pathMap = new Map();
        req.files.forEach((file, index) => {
            console.log(`Mapping originalname: ${file.originalname} to path: ${filePathsList[index]}`);
            pathMap.set(file.originalname, filePathsList[index]);
        });

        // Organize files by their relative paths
        const fileMap = new Map();
        for (const file of req.files) {
            const relativePath = pathMap.get(file.originalname) || file.originalname;
            console.log(`Relative path: ${relativePath}`);
            const fileName = path.basename(relativePath);
            console.log(`File name: ${fileName}`);
            const fileExtension = path.extname(fileName).toLowerCase().slice(1); // Get extension without dot

            // Check if the file is in an ignored folder by splitting path into segments
            const pathSegments = relativePath.split(/[\/\\]/).map(segment => segment.toLowerCase());
            const inIgnoredFolder = pathSegments.some(segment => allIgnoreFolders.includes(segment));

            // Check if the file has an ignored extension
            const hasIgnoredExtension = ignoreExtensionList.includes(fileExtension);

            if (!inIgnoredFolder && !hasIgnoredExtension && !excludeList.includes(fileName)) {
                console.log(`Processing file: ${relativePath}`);
                fileMap.set(relativePath, file.path);
            } else {
                console.log(`Skipping file: ${relativePath} (inIgnoredFolder: ${inIgnoredFolder}, hasIgnoredExtension: ${hasIgnoredExtension}, excluded: ${excludeList.includes(fileName)})`);
            }
        }

        // Read and format file contents
        for (const [relativePath, filePath] of fileMap) {
            const content = await fs.readFile(filePath, 'utf8');
            output.push(`file name: ${relativePath}\n---\n${content}\n`);
        }

        // Write to temporary output file
        const outputPath = path.join(tempDir, outputFileName);
        await fs.writeFile(outputPath, output.join('\n'));

        // Send the file as a response
        res.download(outputPath, outputFileName, async (err) => {
            // Clean up temporary files
            await fs.rm(tempDir, { recursive: true, force: true });
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));