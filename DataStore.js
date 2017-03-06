
class DataStore {
  static safeArgEncode (arg) {
    switch (true) {
      case arg === null:
        return ['null', 'null'];
      case arg === undefined:
        return ['undefined', 'undefined'];
      case Array.isArray(arg):
        return [DataStore.extractArtifactsFromArguments(arg), 'array'];
      default:
        return [arg, typeof arg];
    }
  }
  static deriveArtifactId (arg, index) {
    return [...DataStore.safeArgEncode(arg), index].join('_');
  }
  static extractArtifactsFromArguments (args) {
    var artifacts = [];
    for (var i = 0; i < args.length; i++) {
      artifacts.push(DataStore.deriveArtifactId(args[i], i));
    }
    return artifacts;
  }
  static attemptBranchWalk (artifacts, treeNode) {
    if (!treeNode.children[artifacts[0]]) {
      return false;
    } else if (artifacts.length === 1) {
      // Path fully exists return the leaf
      return treeNode.children[artifacts[0]];
    }
    return this.attemptBranchWalk(artifacts.slice(1), treeNode.children[artifacts[0]]);
  }
  static assimilateIntoTree (artifacts, treeNode, fn, originalArgs) {
    if (artifacts.length === 1) {
      // we now can relate the leaf to the output of the function
      treeNode.children[artifacts[0]] = {
        argument: artifacts[0],
        outputArtifact: fn.apply(fn, originalArgs),
        children: {}
      };
      return treeNode.children[artifacts[0]];
    } else if (!treeNode.children[artifacts[0]]) {
      // This is not a leaf, but it could be..
      treeNode.children[artifacts[0]] = {
        argument: artifacts[0], outputArtifact: null, children: {}
      };
    } // Otherwise the node already exists
    return DataStore.assimilateIntoTree(artifacts.slice(1), treeNode.children[artifacts[0]], fn, originalArgs);
  }
  constructor () {
    this.tree = {root: {children: {}}};
  }
  consume (args, fn) {
    return DataStore.assimilateIntoTree(
      DataStore.extractArtifactsFromArguments(args), this.tree.root, fn, args);
  }
  known (args) {
    return DataStore.attemptBranchWalk(
      DataStore.extractArtifactsFromArguments(args), this.tree.root);
  }
}

module.exports = DataStore;
