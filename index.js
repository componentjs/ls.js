
/**
 * Module dependencies.
 */

var archy = require('archy');
var program = require('commander');
var utils = require('component-consoler');
var resolve = require('component-resolver');

// parse argv

program
  .option('-d, --depth <n>', 'set the depth to <n>', Infinity)
  .parse(process.argv);

// output tree

resolve(process.cwd(), function (err, tree) {
  if (err) utils.fatal(err);
  console.log();
  console.log(indent(archy(traverse(tree))));
})

/**
 * Return the dependency tree of the given config `file`.
 *
 * @param {String} file
 * @param {Array} paths
 * @return {Object}
 */

function traverse(branch, depth) {
  depth = depth || 0;

  var color = !branch.parent
    ? '\033[34m'
    : branch.type === 'local'
    ? '\033[35m'
    : '\033[36m';

  var node = {
    label: color + branch.name + '\033[m'
      + ' \033[90m' + (branch.version || branch.ref || '') + '\033[m',
    nodes: []
  };

  if (++depth > program.depth) return node;

  Object.keys(branch.dependencies).forEach(function (name) {
    node.nodes.push(traverse(branch.dependencies[name]));
  });

  Object.keys(branch.locals).forEach(function (name) {
    node.nodes.push(traverse(branch.locals[name]));
  });

  return node;
}

/**
 * Indent `str`.
 */

function indent(str) {
  return str.replace(/^/gm, '  ');
}
