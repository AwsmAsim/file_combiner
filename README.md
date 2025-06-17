# File Combiner Web App

A simple web application to combine text files from a selected folder into a single output file, with options to exclude specific files, folders, and file extensions. Built with Node.js, Express, and a Tailwind CSS-based HTML interface.

## Features
- **Folder Selection**: Select a folder via a browser-based file picker.
- **File Exclusion**: Specify files to exclude (e.g., `.env`).
- **Folder Exclusion**: Ignore folders (e.g., `node_modules` is always ignored; add others like `dist`).
- **Extension Filtering**: Skip files with specified extensions (e.g., `wav`, `mp3`).
- **Output Format**: Combines files into a single text file with the format:
  ```
  file name: foldername/file.js
  ---
  [file content]
  ```
- **Downloadable Output**: Download the combined file directly from the browser.
- **Debug Logs**: Client and server logs for troubleshooting.

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AwsmAsim/file_combiner.git
   cd file_combiner
   ```

2. **Install Dependencies**:
   ```bash
   npm init -y
   npm install express multer
   ```

3. **Project Structure**:
   ```
   file_combiner/
   ├── index.html
   ├── server.js
   ├── combiner_recording.gif
   ├── package.json
   └── node_modules/
   ```

## Usage
1. **Start the Server**:
   ```bash
   node server.js
   ```
   The app runs at `http://localhost:3000`.

2. **Access the App**:
   - Open `http://localhost:3000` in a browser (Chrome/Edge recommended for folder picker support).
   - Watch the demo: ![Usage Demo](combiner_recording.gif)
   - Use the UI to:
     - **Select Folder**: Choose a folder (e.g., `ai-sales-call-backend`).
     - **Exclude Files**: Enter comma-separated file names (default: `.env`).
     - **Ignore Folders**: Enter comma-separated folder names (e.g., `dist,build`; `node_modules` is always ignored).
     - **Ignore Extensions**: Enter comma-separated extensions (default: `wav,mp3`).
     - **Output File Name**: Specify the output file (default: `combined_output.txt`).
     - Click **Combine Files** to generate and download the output.

3. **Example Output** (`combined_output.txt`):
   ```
   file name: ai-sales-call-backend/index.js
   ---
   const express = require('express');
   const app = express();
   app.get('/', (req, res) => res.send('Hello World!'));
   app.listen(3000, () => console.log('Server running'));

   file name: ai-sales-call-backend/utils.js
   ---
   module.exports = {
     log: (msg) => console.log(`[INFO] ${msg}`)
   };
   ```

## Debugging
- **Client Logs**: Check the browser console for `File relative path` logs (e.g., `ai-sales-call-backend/index.js`).
- **Server Logs**: Check the terminal for:
  - `Number of files` and `Number of file paths`.
  - `Mapping originalname` to full paths.
  - `Processing file` or `Skipping file` with reasons (e.g., `inIgnoredFolder: true` for `node_modules`).
- **Common Issues**:
  - **Wrong Folder**: Ensure the selected folder contains your files (e.g., `index.js`).
  - **node_modules Included**: Verify server logs show `inIgnoredFolder: true` for `node_modules` files.
  - **Browser Compatibility**: Use Chrome/Edge for `webkitdirectory` support.

## Notes
- **Tailwind CSS**: Uses CDN for development. For production, install Tailwind locally:
  ```bash
  npm install -D tailwindcss
  npx tailwindcss init
  ```
- **Browser Extensions**: Errors from `contentscript.js` are likely from extensions; use incognito mode to reduce noise.
- **Large Folders**: May impact performance; test with small folders first.

## Contributing
- Fork the repository, make changes, and submit a pull request.
- Report issues or suggest features via GitHub Issues.

## License
[MIT License](LICENSE) (update with your preferred license).
