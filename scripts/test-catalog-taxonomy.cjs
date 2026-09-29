const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const source = fs.readFileSync(path.join(__dirname, '../src/lib/catalog-taxonomy.ts'), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const target = { exports: {} }
new Function('require', 'module', 'exports', compiled)(require, target, target.exports)
const { buildCatalogTaxonomy } = target.exports
const category = (id, name, parentId = null, externalLevel = 2) => ({
  id, slug: id + '-slug', name, parentId, externalLevel, externalSource: 'THINKLINK',
})
const sources = [
  category('a', 'Brand A', null, 1), category('b', 'Brand B', null, 1),
  category('sa', 'Сервера', 'a'), category('sb', 'Серверы', 'b'),
  category('pa', 'Принтеры', 'a'),
  category('aa', ' Аксессуары ', 'sa', 3), category('ab', 'АКСЕССУАРЫ', 'sb', 3),
  category('ap', 'Аксессуары', 'pa', 3),
]
const tree = buildCatalogTaxonomy(sources, [])
assert.deepEqual(tree.map(n => n.name), ['Принтеры', 'Прочие товары', 'Серверы'])
const servers = tree.find(n => n.name === 'Серверы')
assert.deepEqual(new Set(servers.sourceIds), new Set(['sa', 'sb', 'aa', 'ab']))
assert.equal(servers.children.length, 1)
assert.deepEqual(new Set(servers.children[0].sourceIds), new Set(['aa', 'ab']))
assert.notEqual(servers.children[0].id, tree[0].children[0].id)
assert.deepEqual(tree.find(n => n.name === 'Прочие товары').sourceIds, ['a', 'b'])
assert.equal(buildCatalogTaxonomy([...sources].reverse(), []).find(n => n.name === 'Серверы').id, servers.id)
assert(servers.aliases.includes('sb-slug'))
console.log('PASS: manufacturers removed, categories merged, accessory contexts preserved, stable IDs, direct products retained')
