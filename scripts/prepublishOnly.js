const fs = require("fs");
const path = require("path");

const pkgFile = path.resolve(__dirname, "../package.json");
const backupPkgFile = path.resolve(__dirname, "../package-original.json");
const originalPkg = fs.readFileSync(pkgFile, "utf-8");
const pkg = JSON.parse(originalPkg);

pkg.main = "lib/commonjs/index.js";
delete pkg.devDependencies;
delete pkg.eslintConfig;
delete pkg.scripts;

fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2), "utf-8");
fs.writeFileSync(backupPkgFile, originalPkg, "utf-8");
