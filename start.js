const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const extract = require('extract-zip');
const { exec } = require('child_process');

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    bold: "\x1b[1m",
};

const repoUrl = 'https://github.com/Modraxiss/Aurora-2.0-Slash-Commands/archive/refs/heads/main.zip';
const localPath = path.join(__dirname, 'src');
const tempZipPath = path.join(__dirname, 'tempRepo.zip');
const tempExtractPath = path.join(__dirname, 'tempRepo');

(async () => {
    console.log(`${colors.cyan}${colors.bold}Starting the update process...${colors.reset}`);

    try {
        console.log(`${colors.blue}Removing old source code...${colors.reset}`);
        await fs.remove(localPath);

        console.log(`${colors.blue}Downloading the latest code...${colors.reset}`);
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

        console.log(`${colors.blue}Extracting downloaded files...${colors.reset}`);
        await extract(tempZipPath, { dir: tempExtractPath });

        const extractedSrcPath = path.join(tempExtractPath, 'Aurora-2.0-Slash-Commands-main', 'src');
        const extractedPackageJsonPath = path.join(tempExtractPath, 'Aurora-2.0-Slash-Commands-main', 'package.json');
        const extractedPackageLockJsonPath = path.join(tempExtractPath, 'Aurora-2.0-Slash-Commands-main', 'package-lock.json');

        console.log(`${colors.blue}Moving files to the correct locations...${colors.reset}`);
        await fs.move(extractedSrcPath, localPath);
        await fs.move(extractedPackageJsonPath, path.join(__dirname, 'package.json'), { overwrite: true });
        await fs.move(extractedPackageLockJsonPath, path.join(__dirname, 'package-lock.json'), { overwrite: true });

        console.log(`${colors.blue}Cleaning up temporary files...${colors.reset}`);
        await fs.remove(tempZipPath);
        await fs.remove(tempExtractPath);

        console.log(`${colors.green}${colors.bold}✔ Bot has been updated successfully!${colors.reset}`);

        await managePackages();

        setTimeout(startBot, 2000);
    } catch (err) {
        console.error(`${colors.red}${colors.bold}✖ Error during update process:${colors.reset}\n`, err);
    }
})();

async function managePackages() {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Checking for missing and unused packages...${colors.reset}`);

        exec('npm install --omit=dev && npm prune', (error, stdout, stderr) => {
            if (error) {
                console.error(`${colors.red}${colors.bold}✖ Error managing packages:${colors.reset} ${error}`);
                reject(error);
                return;
            }
            console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
        });
    });
}

function startBot() {
    console.clear();
    console.log(`${colors.magenta}Starting the bot...${colors.reset}`);
    const botProcess = exec('node src/index.js');

    botProcess.stdout.on('data', (data) => {
        process.stdout.write(`${colors.cyan}${data}${colors.reset}`);
    });

    botProcess.stderr.on('data', (data) => {
        process.stderr.write(`${colors.red}${data}${colors.reset}`);
    });

    botProcess.on('close', (code) => {
        console.log(`${colors.magenta}${colors.bold}Bot process exited with code ${code}${colors.reset}`);
    });
}
