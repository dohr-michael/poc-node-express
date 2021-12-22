const fs = require('fs'),
    path = require('path');


const currentFolder = process.cwd();

const packageJson = JSON.parse(fs.readFileSync(path.resolve(currentFolder, 'package.json')));

delete packageJson['devDependencies'];
delete packageJson['scripts'];
const distPackagePath = path.resolve(currentFolder, 'dist', 'package.json');
if (fs.existsSync(distPackagePath)) {
    fs.unlinkSync(distPackagePath);
}
fs.writeFileSync(distPackagePath, JSON.stringify(packageJson, null, 2));

