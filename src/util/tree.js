const isString = require('lodash/isString');
const isObject = require('lodash/isObject');
const map = require('lodash/map');
const filter = require('lodash/filter')

function getPrefixTargetKeys() {
  /*
  前缀
  */
  const targetKeys = ['a', 'a-b', 'a-b-c', 'd', 'd-e-f', 'h-j-k', 'm', 'm-n', 'r-s-t', 'r-s-u', 'r-v']

  function count(p){
    let cnt = 0
    for (let c of p) {
      if (c === '-')
        cnt++
    }
    return cnt
  }

  targetKeys.sort((a,b) => count(a)-count(b))

  console.log(targetKeys)
  /*
  [
        'a',     'd',
        'm',   'a-b',
      'm-n', 'a-b-c',
    'd-e-f', 'h-j-k',
    'r-s-t', 'r-s-u'
  ]
  */
  const keys = []
  for (let k of targetKeys) {
    let flag = 0, s = ''
    for (let c of k) {
      s += c
      if (keys.indexOf(s) !== -1) {
        flag = 1
        break;
      }
    }
    if (!flag) {
      keys.push(k)
    }
  }
  console.log(keys)
  const res = {}
  for (let path of keys){
    let node = res
    for (let step of path.split('-')) {
      node[step] = node[step] || {}
      node = node[step]
    }
  }
  console.log(res)
  /*
  {
    a: {},
    d: {},
    h: { j: { k: {} } },
    m: {},
    r: { s: { t: {}, u: {} } }
  }
  */
}


const regionMap = 
  {
    上海: {
      宝山区: '310113',
      嘉定区: '310114'
    },
    浙江: {
      嘉兴市: {
        嘉善县: '330421'
      }
    }
  }

function makeRegionOptions(data) {
/*   value: 'zhejiang',
    label: 'Zhejiang',
    children: [...]*/
    const opts = map(data, (value, key) => {
      return {
        value: value,
        label: key,
        children: isObject(value) ? makeRegionOptions(value) : null,
      }
    })
    return filter(opts, o => o.label === '全部').concat(filter(opts, o => o.label !== '全部'));


}
function setRegionAll(map, top=true) {
  // 自底向上
  if (isString(map)) {
    return
  }
  for (let k in map) {
      setRegionAll(map[k], false)
      if (isString(map[k])) {
        const all = `${map[k].slice(0,4)}00`;
        if (!map.全部) {
          map.全部 = all
        } else {
          console.assert(all, map.全部)
        }
      } else if (map[k].全部 && !top) {
        const all = `${map[k].全部.slice(0,2)}0000`
        if (!map.全部) {
          map.全部 = all
        } else {
          console.assert(all, map.全部)
        }
      }
  }
  return map;
}

const  res = setRegionAll(regionMap);
console.log(res);
console.log(JSON.stringify(makeRegionOptions(res)))
/*
{
  '上海': { '宝山区': '310113', '全部': '310100' },
  '浙江': { '嘉兴市': { '嘉善县': '330421', '全部': '330400' }, '全部': '330000' }
}
*/