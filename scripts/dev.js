const electron = require('electron');
const proc = require('child_process');

// Remove NODE_OPTIONS para que flags como --openssl-legacy-provider
// (usadas pelo React/Webpack) não sejam repassadas para o Electron.
const env = { ...process.env };
delete env.NODE_OPTIONS;

const child = proc.spawn(electron, process.argv.slice(2), { stdio: 'inherit', env });
child.on('close', function (code) { process.exit(code) });
