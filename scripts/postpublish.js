const fs = require("fs");
const path = require("path");

const pkgFile = path.resolve(__dirname, "../package.json");
const backupPkgFile = path.resolve(__dirname, "../package-original.json");

fs.unlinkSync(pkgFile);
fs.renameSync(backupPkgFile, pkgFile);
