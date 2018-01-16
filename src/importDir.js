// TODO return as dot compatible items
// TODO be able to nest as the directory structure
// TODO has an option for including directories or not (so only for the '.js' files)
// TODO File/Directory name regex (incl. extension)

const fs = require('fs');
const path = require('path');

// ...but for now
/* let absolutePath = ''; */

function processImport(rootPath, relativeImportPath) {
  /* absolutePath = path.join(this.bootstrappersPath, relativeImportPath); */
  /* tempBootstrapperDescriptor = {
    name: path.basename(relativeImportPath, '.js'),
    relativePath: relativeImportPath,
    absolutePath: path.join(this.bootstrappersPath, relativeImportPath),
  }; */
  /* const bootstrapper = require(absolutePath); // eslint-disable-line global-require, import/no-dynamic-require, max-len */
  /* const bootstrapper = require(tempBootstrapperDescriptor.absolutePath); */ // eslint-disable-line global-require, import/no-dynamic-require, max-len
  /* tempBootstrapperDescriptor.priority = bootstrapper.priority;
  // FIXME Check if `bootstrapper` extends the bootstrapperBase
  // FIXME Change something else from 'Provider'
  tempBootstrapperDescriptor = {
    ...tempBootstrapperDescriptor,
    ...(new (bootstrapper.Clazz)()),
  }; */

  /* if (fs.statSync(tempBootstrapperDescriptor.absolutePath).isDirectory()) {
    if (fs.existsSync(`${tempBootstrapperDescriptor.absolutePath}/index.js`)) {
      // TODO Use index.js
    } else {
      // TODO May require each file
    }
  } else { */
    /* this._bootstrapperDescriptors.insert(tempBootstrapperDescriptor); */
    /* bootstrapper.name = path.basename(relativeImportPath, '.js');
    bootstrapper.relativePath = relativeImportPath;
    bootstrapper.absolutePath = absolutePath;
    this._bootstrapperDescriptors.insert(bootstrapper); */
  /* } */

  const ret = {
    name: path.basename(relativeImportPath, '.js'),
    relativePath: relativeImportPath,
    /* absolutePath, */
    absolutePath: `${rootPath}/${relativeImportPath}`,
  };

  ret.fn = require(ret.absolutePath); // eslint-disable-line

  return ret;
}

module.exports = (importPath) => {
  // FIXME Exclude starts with '_'
  // TODO extension support
  const rawImportPaths = fs
    .readdirSync(importPath)
    .filter(key => (key[0] !== '_'));
  /* const processedImportPaths = rawImportPaths.map((rawImportPath) => {
    return `ROOT/${rawImportPath}`;
  }); */
  const imports = {};

  let currImport = null;
  /* eslint-disable */
  /* for (const currImportPath of processedImportPaths) { */
  for (const currImportPath of rawImportPaths) {
    /* processImport.call(this, currImportPath); */
    currImport = processImport.call(this, importPath, currImportPath);
    imports[currImport.name] = currImport.fn;
    // OR
    /* imports[currImport.name] = currImport; */
  }
  /* eslint-enable */

  return imports;
};
/* module.exports = path => requireDirectory(path); */
