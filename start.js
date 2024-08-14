const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const extract = require('extract-zip');
const { exec } = require('child_process');

const repoUrl = 'https://github.com/Modraxiss/Aurora-2.0-Slash-Commands/archive/refs/heads/main.zip';
const localPath = path.join(__dirname, 'src');
const tempZipPath = path.join(__dirname, 'tempRepo.zip');
const tempExtractPath = path.join(__dirname, 'tempRepo');

(async () => {
    console.log('Starting update process...');

    try {
        await fs.remove(localPath);

        const response = await axios({
            url: repoUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const fileStream = fs.createWriteStream(tempZipPath);
        response.data.pipe(fileStream);

        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        await extract(tempZipPath, { dir: tempExtractPath });

        const extractedSrcPath = path.join(tempExtractPath, 'Aurora-2.0-Slash-Commands-main', 'src');
        await fs.move(extractedSrcPath, localPath);

        await fs.remove(tempZipPath);
        await fs.remove(tempExtractPath);

        console.log(`\x1b[31m%s\x1b[0m`, 'Bot has been updated successfully.');
        startBot();
    } catch (err) {
        console.error('Error during update process:', err);
    }
})();

function startBot() {
    const botProcess = exec('node src/index.js');

    botProcess.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    botProcess.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    botProcess.on('close', (code) => {
        console.log(`Bot process exited with code ${code}`);
    });
}
